import SearchBar from "../searchBar/SearchBar";
import SelectInvestmentsForm from "./DashboardSummarySelectForm"
import DashboardSummaryLabels from "./DashboardSummaryLabels.js";

const DashboardSummary = (props) =>{
    return (
    <div className="dashboard-summary-data"> 
        <h2 id="dashboard-summary-title" className="w-100">Overview</h2>
        <DashboardSummaryLabels {...props}/>
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