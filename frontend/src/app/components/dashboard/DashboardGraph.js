
import LoadingIcon from "../loadingIcon/LoadingIcon"
import MultiLineChart from "./MultiLineChart"
import { useParseInvestmentHistory } from "../../hooks/use-parse-investment-data"

// Create new instance
const DashboardGraph = ({
    investmentData,
    trackedInvestments,
    className,
    graphClassName, 
    graphKey
}) =>{
    const [filteredData, isLoading] = useParseInvestmentHistory({
        trackedInvestments,
        investmentData
    })
    const dimensions = {
        width: 600, 
        height: 400, 
        margin: {
            top: 12,
            left: 50,
            bottom: 15,
            right: 0,        
        }
    }
    return (
        <>
        <div className={`d-flex ${className}`}>
            {isLoading && <LoadingIcon 
                bgColor={"rgba(0, 0, 0, 0.198)"}
            />}
            {filteredData.length !== 0 && 
                <MultiLineChart 
                    data = {filteredData}
                    dimensions = {dimensions}
                    className = {graphClassName}
                    graphKey = {graphKey}
                />
            }
            
            {graphKey && 
                <div className={className+"-key"}>

                </div>
            }
        </div>
        
        </>
    )
}
export default DashboardGraph