import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const indicatorStyles = (value) =>{
    return {
        color: parseFloat(value)>=0 ? "green" : "red",
    }
}
const DashboardSummaryLabels = ({
    summaryLabels,
}) =>{ 
    return (
    <>
    {/* {/*generate summary items*/
        summaryLabels ? 
        summaryLabels.map((data) => {
            const checkEmpty = Object.keys(data.value).length === 0 
            const value = checkEmpty ?  0: data.value
            return(
                <div key={data.label} className="summary-row">
                    <p className="row-label">{data.label}</p>
                    <div className="flex-grow-1 row-data">
                        <p className="d-flex justify-content-end">
                            {
                                (data.label === "Top Performing Investment" || data.label === "Lowest Performing Investment") ? 
                                <>
                                    <span>{value.investmentSymbol}</span> 
                                </>
                                : !data.percentage ? value
                                : null
                            }
                            {//this is seperate, since top performing, and lowest performing
                            //can also have carets
                                data.percentage ?
                                    <span
                                        className ="d-flex align-items-end ms-1"
                                        style = {indicatorStyles(data.percentage)}
                                    >
                                        <FontAwesomeIcon 
                                            icon={parseFloat(data.percentage ) >= 0 ? faCaretUp : faCaretDown} 
                                        /> 
                                        <span className="ms-1"> {data.percentage}% </span>
                                    </span>
                                : null
                            }
                        </p>
                    </div>
                </div>
            )
        })
    : null}
    </>
    )
}
export default DashboardSummaryLabels