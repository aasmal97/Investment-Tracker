import SearchBar from "../searchBar/SearchBar";
import SelectInvestmentsForm from "./DashboardSummarySelectForm"
import DashboardSummaryLabels from "./DashboardSummaryLabels.js";
import { getUserData, updateUserData, resetUserDataStatus} from "../../../redux/features/userInfo/userInfoSlice";
import { getInvestData, resetInvestHistoryStatus} from "../../../redux/features/investData/investDataSlice";
import {getSearchData, resetSearch} from "../../../redux/features/investData/searchInvestSlice"
import { useAuth } from "../../contexts/AuthContext";
import {useRef, useEffect, useState } from "react"
import debounce from "lodash.debounce";
import pastelColors from "../../../utilityFunc/pastelColors";
import {useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";

const DashboardSummary = ({
    userInfo
}) =>{
    const dispatch = useDispatch()
    const investmentData = useSelector((state) => state.investmentData)
    const {currentUser} = useAuth()
    const [searchType, setSearchType] = useState("crypto")
    const [searchInput, setSearchInput] = useState("")
    const [selectionsSubmitted, setSelectionsSubmitted] = useState(false)
    const [selectedInvestments, setSelectedInvestments] = useState([])
    const searchResults = useSelector((state) => state.searchInvestments)

    const [trackingWarning, setTrackingWarning] = useState(false)

    const summaryLabels = investmentData._id !== "" ? [
        {
            label: "Top Performing Investment", 
            value: investmentData.topInvestment, 
            percentage: investmentData.topInvestment.percentChange
        },
        {
            label: "Portfolio Total", 
            value: "$" + investmentData.investmentTotal
        },
        {
            label: "Principal Invested", 
            value: "$" + investmentData.principalInvested
        },
        {
            label: "Investment Gains", 
            value: "$" + investmentData.investmentGains
        },
        {
            label: "Percent Change", 
            value: investmentData.yearlyPercentChange, 
            percentage: investmentData.yearlyPercentChange
        }
    ] : null
    useEffect(()=>{
        //only grab if store is not empty. We want to avoid too many requests
        const requestData = {
            token: currentUser.accessToken, 
            actionType:"initialLoad", 
            investmentData: (e) => {dispatch(getInvestData(e))},
            resetUserDataStatus : () => {dispatch(resetUserDataStatus())},
            resetInvestHistoryStatus: () => {dispatch(resetInvestHistoryStatus())}
        }
        if(userInfo._id === "") dispatch(getUserData(requestData))
    }, [dispatch, currentUser.accessToken, userInfo._id])

    const onSearchBtnClick = (e) =>{
        const selectedSearchType = e.target.closest("button").dataset.searchType
        setSearchType(selectedSearchType)
        dispatch(resetSearch())
    }
    const onSearchQuery = (keywords) =>{
        //if only white space, do not perform a search query
        const checkString = keywords.keywords
        if(!checkString.trim()) return dispatch(resetSearch())
        dispatch(getSearchData(keywords))
    }
    const debouncedSearchQuery = useRef(debounce((keywords) => onSearchQuery(keywords), 1000)).current;
    const onSearchChange = (e) =>{
        const keywords = {
            type : searchType,
            token: currentUser.accessToken,
            keywords: e.target.value
        }
        setSearchInput(e.target.value)
        debouncedSearchQuery(keywords)
    }
    //update input field
    const onAddInvestFormChange = (e) =>{
        const index= e.target.dataset.index
        const value = e.target.value
        const newSelections = [...selectedInvestments]
        const testInput = /^\s*(?=.*[0-9])\d*(?:\.\d{1,2})?\s*$/
        const invalidInput = value !== "" && !testInput.test(value) && value[value.length-1]!=="."
        if(invalidInput) return
        newSelections[index]["investedAmount"] = value.toString()
        setSelectedInvestments(newSelections)
    }
    //user selects the investment to add
    const onAddInvestClick = (e) =>{
        const name = e.target.closest("button").dataset.name
        const symbol = e.target.closest("button").dataset.ticker
        const newSelections = [...selectedInvestments]
        //means it already exists
        const checkSelected = !newSelections.every((value) => (value.symbol !== symbol) || (value.symbol === symbol && value.investmentType !== searchType))
        const checkTracked = !userInfo.trackedInvestments.every((value) => (value.symbol !== symbol) || (value.symbol === symbol && value.investmentType !== searchType))
        if(checkSelected || checkTracked) {
            setTrackingWarning(true)
            setTimeout(() => {
                setTrackingWarning(false)
            }, 4000)
            return
        }
        const currDate = new Date()
        const newSelected = {
            investmentType: searchType,
            name: name, 
            lastViewed: currDate,
            symbol: symbol,
            investedAmount:"0", 
            prevBalance: "0",
            color: pastelColors(),
            dateAdded:{
                date: currDate,
            }
        }
        newSelections.push(newSelected)
        setSelectedInvestments(newSelections)
        //hide dropdown and reset query
        dispatch(resetSearch())
        setSearchInput("")
    }
    //user deletes the investment from form
    const onDeleteInvestClick = (e) =>{
        const investment = e.target.closest("button").dataset.symbol
        const newSelections = selectedInvestments.filter((invest)=>invest["symbol"]!==investment)
        //update total balance for investments to be added after
        setSelectedInvestments(newSelections)
    }
    //when user  submits form
    const onSaveInvestSubmit = async (e) =>{
        //prevent refresh
        e.preventDefault()
        if(selectionsSubmitted) return
        setSelectionsSubmitted(true)
        let copySelections = [...selectedInvestments]
        let accumalate = parseFloat(investmentData.investmentTotal)
        for(let selection of copySelections){
            selection.prevBalance = accumalate.toFixed(2).toString()
            accumalate += parseFloat(selection.investedAmount)
        }
        const updatedInvest = {
            actionType: "addInvestment",
            token: currentUser.accessToken,
            searchType: searchType,
            trackedInvestments: [...userInfo.trackedInvestments],
            cashTransactions: [...investmentData.cashTransactions],
            selectedInvestments: [...copySelections],
            //store reducer to update userData after a call to get investment data values
            updateUserData: (e) => {dispatch(updateUserData(e))},
            resetUserDataStatus : () => {dispatch(resetUserDataStatus())},
            resetInvestHistoryStatus: () => {dispatch(resetInvestHistoryStatus())}
        }
        dispatch(getInvestData(updatedInvest))
        setSelectedInvestments([])
        setSelectionsSubmitted(false)
    }
    return (
    <div className="dashboard-summary-data"> 
        {trackingWarning && 
            createPortal(
                <div className="alert alert-danger dashboard-tracking-warning">
                    You have already selected, or are tracking this investment
                </div>
            , document.body)
        }
        <h2 id="dashboard-summary-title" className="w-100">Overview</h2>
        <DashboardSummaryLabels 
            summaryLabels={summaryLabels}
        />
        <div className="summary-row">  
            <SearchBar
                searchBarAdd = {true} 
                label = {"Add " + searchType[0].toUpperCase()+searchType.substring(1) }
                className = {"d-flex align-items-center summary-search justify-content-between"}
                searchInput = {searchInput}
                searchResults = {searchResults}
                onSearchClick = {onSearchBtnClick}
                onSearchChange = {onSearchChange}
                searchType = {searchType}
                searchPlaceholder = {
                        searchType==="crypto" ? "BTC, Bitcoin, etherum, etc"
                        : searchType==="stock" ? "Apple, AAPL, tesla, etc"
                        : null
                    }
                onAddInvestClick = {onAddInvestClick}
            />
            
            {//generate form of selected investments
            selectedInvestments.length !== 0 ? 
                <SelectInvestmentsForm 
                    onSaveInvestSubmit = {onSaveInvestSubmit}
                    selectionsSubmitted = {selectionsSubmitted}
                    onDeleteInvestClick = {onDeleteInvestClick}
                    onAddInvestFormChange = {onAddInvestFormChange}
                    selectedInvestments = {selectedInvestments}
                />
            :null}
        </div>
    </div>
    )
}
export default DashboardSummary
