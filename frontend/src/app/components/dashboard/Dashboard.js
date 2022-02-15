import {useSelector } from "react-redux";

import DashboardCard from "./DashboardCard"
import DashboardSummary from "./DashboardSummary";
import DashboardGraph from "./DashboardGraph"

import useWindowWidth from "../../hooks/use-window-width";
const Dashboard = () =>{
    const userInfo = useSelector((state) => state.userInfo)
    const investmentData = useSelector((state) => state.investmentData)
    const windowWidth = useWindowWidth(992)

    return(
        <div className="dashboard-container">
            
            {(investmentData.status ==="failed") && <div className="alert alert-danger dashboard-tracking-warning">
                    We were unable to find data 
                    {investmentData.errorSymbolCause ? 
                        ` on the following investment: ${investmentData.errorSymbolCause}.`
                    :"on one or more of your investments."} Please contact {" "}
                    <a href="mailto:arkyasmal@gmail.com">arkyasmal@gmail.com</a> for more details.  
            </div>}
            <div className = {`d-flex w-100 ${!windowWidth && "flex-column align-items-center"}`}>
                <DashboardSummary
                    userInfo = {userInfo}
                    searchInputId = {"search-input-id"}
                />
                <DashboardGraph 
                    className = "dashboard-all-investments-graph"
                    graphKey = {true}
                    trackedInvestments = {userInfo.trackedInvestments}
                    investmentData = {investmentData}
                    graphClassName ={"dashboard-all-investments-graph-data"}
                />
            </div>
            <div className = "dashboard-card-container">
                {userInfo.trackedInvestments.length === 1 && userInfo.trackedInvestments[0].name ==="" ?
                    <div>
                        <p>You are not tracking any investments. Add one to get started</p>
                    </div>
                : userInfo.trackedInvestments.map((investment) => {
                    //we do this maintain the object structure
                    // that components meant to generate multiple are built more. 
                    // but simulates only one line being generated
                    //as opposed to multiple. This allows us to reuse 
                    //the same components and get our intended result
                    const symbol = investment.symbol
                    const investmentType = investment.investmentType
                    const newData = {
                        crypto: {},
                        stock: {}
                    }
                    if( investmentType === "stock") newData.stock[symbol] = investmentData.stock[symbol] ? investmentData.stock[symbol] : []
                    if( investmentType === "crypto") newData.crypto[symbol] = investmentData.crypto[symbol] ? investmentData.crypto[symbol] : []
                    return (
                        <DashboardCard 
                            key = { investmentType + symbol}
                            trackedInvestments = {[investment]}
                            investmentData = {newData}
                        />
                    )
                })}
            </div>
        </div>
    )
}
export default Dashboard