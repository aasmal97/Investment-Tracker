import { useMemo, useEffect, useState } from "react"
import {useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../redux/features/userInfo/userInfoSlice";
import { getInvestData } from "../../../redux/features/investData/investDataSlice";
import {getSearchData, resetSearch} from "../../../redux/features/investData/searchInvestSlice"
import { useAuth } from "../../contexts/AuthContext";
import DashboardCard from "./DashboardCard"
import DashboardSummary from "./DashboardSummary";
import DashboardGraph from "./DashboardGraph"
import debounce from "lodash.debounce"
const Dashboard = (props) =>{
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.userInfo)
    const investmentData = useSelector((state) => state.investmentData)
    const searchResults = useSelector((state) => state.searchInvestments)
    const {currentUser} = useAuth()
    const [searchType, setSearchType] = useState("crypto")
    const [searchInput, setSearchInput] = useState("")
    const [selectedInvestments, setSelectedInvestments] = useState([])
    useEffect(()=>{
        //only grab if store is not empty. We want to avoid too many requests
        if(userInfo._id === "") dispatch(getUserData(currentUser.accessToken))
    }, [dispatch, currentUser.accessToken, userInfo._id])
    //get investment data
    // useEffect(() =>{
        
    // }, [dispatch])
    const onSearchBtnClick = (e) =>{
        const searchType = e.target.closest("button").dataset.searchType
        setSearchType(searchType)
        resetSearch()
    }
    const onSearchQuery = (e) =>{
        const keywords = {
            type : searchType,
            token: currentUser.accessToken,
            keywords: e.target.value
        }
        dispatch(getSearchData(keywords))
    }
    const debouncedSearchQuery = useMemo(
        () => debounce(onSearchQuery, 1000)
    , []);
   
    const onSearchChange = (e) =>{
        setSearchInput(e.target.value)
        debouncedSearchQuery(e)
    }
    return(
        <div className="dashboard-container">
            <div className = "d-flex w-100">
                <DashboardSummary
                    searchInput = {searchInput} 
                    onClick = {onSearchBtnClick}
                    onChange = {onSearchChange}
                    searchType = {searchType}
                    searchResults = {searchResults}
                    searchPlaceholder = {
                        searchType==="crypto" ? "BTC, Bitcoin, etherum, etc"
                        : searchType==="stock" ? "Apple, AAPL, tesla, etc"
                        : null
                    }
                />
                <div className="d-flex w-100 dashboard-all-investments-graph">
                    <DashboardGraph 
                        className = "dashboard-all-investments-graph-data"
                        graphKey = {true}
                        investments = {userInfo.tracked_investments}
                    />
                </div>
            </div>
            <div className = "d-flex flex-wrap justify-content-center">
                {userInfo.tracked_investments.length === 0 ?
                    <>
                        <p>You are not tracking any investments. Add one to get started</p>
                    </>
                : userInfo.tracked_investments.map((investment) => {
                    return (
                        <DashboardCard 
                            investments = {[investment]}
                        />
                    )
                })}
            </div>
        </div>
    )
}
export default Dashboard