
import DashboardGraph from "./DashboardGraph"
const DashboardCard = ({
    trackedInvestments,
    investmentData,
}) =>{
    return(
        <div className="dashboard-card">
            <DashboardGraph 
                trackedInvestments={trackedInvestments}
                investmentData = {investmentData}
                singleLine = {true}
            />
        </div>
    )
}
export default DashboardCard