import { useEffect, useState } from "react"
import {useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../redux/features/userInfo/userInfoSlice";
import { useAuth } from "../../contexts/AuthContext";
import DashboardCard from "./DashboardCard"
import SearchBar from "../searchBar/SearchBar";
const Dashboard = (props) =>{
    const dispatch = useDispatch()
    const userInfo = useSelector((state) => state.userInfo)
    const {currentUser} = useAuth()
    const [search, setSearch] = useState("")

    useEffect(()=>{
        //only grab if store is not empty. We want to avoid too many requests
        if(userInfo._id === "") dispatch(getUserData(currentUser.accessToken))
    }, [dispatch, currentUser.accessToken])
    console.log(userInfo.tracked_investments)
    return(
        <div className="dashboard-container">
            <div className = "d-flex">
                <div className="dashboard-summary-data w-100"> 

                </div>
                <div className="d-flex w-100 dashboard-all-investments-graph">
                    <div className="dashboard-all-investments-graph-data">

                    </div>
                    <div className="dashboard-all-investments-graph-key">

                    </div>
                </div>
            </div>
            <div className = "d-flex flex-wrap justify-content-center">
                {userInfo.tracked_investments.length === 0 ?
                    <>
                    <SearchBar />
                    <p>You are not tracking any investments. Add one to get started</p>
                    </>
                : userInfo.tracked_investments.map((investment) => {
                    return (
                        <DashboardCard 
                            investment_abbrev = {investment.name}
                            invested_amount = {investment.invested_amount}
                            last_viewed = {investment.last_viewed}
                        />
                    )
                })}
            </div>
        </div>
    )
}
export default Dashboard