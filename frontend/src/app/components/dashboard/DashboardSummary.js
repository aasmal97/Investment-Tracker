import SearchBar from "../searchBar/SearchBar";
import SelectInvestmentsForm from "./DashboardSummarySelectForm"
import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const indicatorStyles = (value) =>{
    return {
        color: parseFloat(value)>=0 ? "green" : "red",
    }
}
const DashboardSummary = (props) =>{
    return (
    <div className="dashboard-summary-data"> 
        <h2 id="dashboard-summary-title" className="w-100">Overview</h2>
        {/* {/*generate summary items*/
            props.summaryLabels ? 
                props.summaryLabels.map((data) => {
                    const checkEmpty = Object.keys(data.value).length === 0 
                    const value = checkEmpty ?  0: data.value
                    return(
                        <div key={data.label} className="summary-row d-flex align-items-center justify-content-between">
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
        <div className="summary-row">  
            <SearchBar
                searchBarAdd = {true} 
                label = {"Add " + props.searchType[0].toUpperCase()+props.searchType.substring(1) }
                className = {"d-flex align-items-center summary-search justify-content-between"}
                {...props}
            />
            
            {//generate form of selected investments
            props.selectedInvestments.length !== 0 ? 
                <SelectInvestmentsForm {...props}/>
            :null}
        </div>
    </div>
    )
}
export default DashboardSummary