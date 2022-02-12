import {useRef, useEffect, useState } from "react"
import {useDispatch, useSelector } from "react-redux";
import { getUserData, updateUserData, resetUserDataStatus} from "../../../redux/features/userInfo/userInfoSlice";
import { getInvestData, resetInvestHistoryStatus} from "../../../redux/features/investData/investDataSlice";
import {getSearchData, resetSearch} from "../../../redux/features/investData/searchInvestSlice"
import { useAuth } from "../../contexts/AuthContext";
import DashboardCard from "./DashboardCard"
import DashboardSummary from "./DashboardSummary";
import DashboardGraph from "./DashboardGraph"
import debounce from "lodash.debounce";
import useWindowWidth from "../../hooks/use-window-width";
import pastelColors from "../../../utilityFunc/pastelColors"
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
    
    return(
        <div className="dashboard-container">
            {trackingWarning && <div className="alert alert-danger dashboard-tracking-warning">
                    You have already selected, or are tracking this investment
                </div>}
            {investmentData.status ==="failed" && <div className="alert alert-danger dashboard-tracking-warning">
                    We were unable to find data 
                    {investmentData.errorSymbolCause ? 
                        ` on the following investment: ${investmentData.errorSymbolCause}.`
                    :"on one or more of your investments."} Please contact {" "}
                    <a href="mailto:arkyasmal@gmail.com">arkyasmal@gmail.com</a> for more details.  
            </div>}
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
                    investmentData = {investmentData}
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
                            key = {investment.investmentType + investment.symbol}
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