import {useRef, useEffect, useState } from "react"
import {useDispatch, useSelector } from "react-redux";
import { getUserData, updateUserData } from "../../../redux/features/userInfo/userInfoSlice";
import { getInvestData } from "../../../redux/features/investData/investDataSlice";
import {getSearchData, resetSearch} from "../../../redux/features/investData/searchInvestSlice"
import { useAuth } from "../../contexts/AuthContext";
import DashboardCard from "./DashboardCard"
import DashboardSummary from "./DashboardSummary";
import DashboardGraph from "./DashboardGraph"
import debounce from "lodash.debounce";
import useWindowWidth from "../../hooks/use-window-width";
const Dashboard = (props) =>{
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.userInfo)
    const investmentData = useSelector((state) => state.investmentData)
    const searchResults = useSelector((state) => state.searchInvestments)
    const windowWidth = useWindowWidth(992)
    const {currentUser} = useAuth()
    const [searchType, setSearchType] = useState("crypto")
    const [searchInput, setSearchInput] = useState("")
    const [selectionsSubmitted, setSelectionsSubmitted] = useState(false)
    const [selectedInvestments, setSelectedInvestments] = useState([])
    //const totalInSelected = useRef("0")
    const topInvestment = 0
    const investmentTotal = 0
    const principalInvested = 0
    const investmentGains = 0
    const percentChange = 0
    const summaryLabels = [
        {label: "Top Performing Investment", value: topInvestment},
        {label: "Portfolio Total", value: investmentTotal},
        {label: "Principal Invested", value: principalInvested},
        {label: "Investment Gains", value: investmentGains},
        {label: "Percent Change", value: percentChange}
    ]
    useEffect(()=>{
        //only grab if store is not empty. We want to avoid too many requests
        if(userInfo._id === "") dispatch(getUserData(currentUser.accessToken))
    }, [dispatch, currentUser.accessToken, userInfo._id])
    //get investment data
    // useEffect(() =>{
        
    // }, [dispatch])
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
        if(!newSelections.every((value) => value.symbol !== symbol)) return
        const newSelected = {
            investmentType: searchType,
            name: name, 
            lastViewed: new Date(), 
            symbol: symbol,
            investedAmount:"0", 
            prevBalance: "0"
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
        // //update total balance for investments to be added after
        setSelectedInvestments(newSelections)
    }
    //when user  submits form
    const onSaveInvestSubmit = async (e) =>{
        //prevent refresh
        e.preventDefault()
        if(selectionsSubmitted) return
        setSelectionsSubmitted(true)
        let copySelections = [...selectedInvestments]
        let accumalate = parseFloat(investmentTotal)
        for(let selection of copySelections){
            selection.prevBalance = accumalate.toFixed(2).toString()
            accumalate += parseFloat(selection.investedAmount)
        }
        const updatedInvest = {
            actionType: "addInvestment",
            token: currentUser.accessToken,
            searchType: searchType,
            trackedInvestments: [...userInfo.trackedInvestments],
            cashTransactions: [...userInfo.cashTransactions],
            selectedInvestments: [...copySelections],
            //store reducer to update userData after a call to get investment data values
            updateUserData: (e) => {dispatch(updateUserData(e))}
        }
        dispatch(getInvestData(updatedInvest))
        setSelectedInvestments([])
        setSelectionsSubmitted(false)
    }
    
    return(
        <div className="dashboard-container">
            <div className = {`d-flex w-100 ${!windowWidth && "flex-column align-items-center"}`}>
                <DashboardSummary
                    userInfo = {userInfo}
                    onSearchClick = {onSearchBtnClick}
                    onSearchChange = {onSearchChange}
                    onSaveInvestSubmit = {onSaveInvestSubmit}
                    onAddInvestClick = {onAddInvestClick}
                    onDeleteInvestClick = {onDeleteInvestClick}
                    onAddInvestFormChange = {onAddInvestFormChange}
                    summaryLabels = {summaryLabels}
                    selectedInvestments = {selectedInvestments}
                    searchInputId = {"search-input-id"}
                    searchInput = {searchInput} 
                    searchType = {searchType}
                    searchResults = {searchResults}
                    selectionsSubmitted = {selectionsSubmitted}
                    searchPlaceholder = {
                        searchType==="crypto" ? "BTC, Bitcoin, etherum, etc"
                        : searchType==="stock" ? "Apple, AAPL, tesla, etc"
                        : null
                    }
                />
                <DashboardGraph 
                    className = "dashboard-all-investments-graph"
                    graphKey = {true}
                    investments = {userInfo.trackedInvestments}
                />
            </div>
            <div className = "d-flex flex-wrap justify-content-center w-100">
                {userInfo.trackedInvestments.length === 1 && userInfo.trackedInvestments[0].name ==="" ?
                    <div>
                        <p>You are not tracking any investments. Add one to get started</p>
                    </div>
                : userInfo.trackedInvestments.map((investment) => {
                    return (
                        <DashboardCard 
                            investments = {[investment]}
                            investmentData = {investmentData[investment.symbol]}
                        />
                    )
                })}
            </div>
        </div>
    )
}
export default Dashboard