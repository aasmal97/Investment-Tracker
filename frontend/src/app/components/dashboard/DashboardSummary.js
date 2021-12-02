import SearchBar from "../searchBar/SearchBar";

const DashboardSummary = (props) =>{
    
    return (
    <div className="dashboard-summary-data"> 
        <h2 id="dashboard-summary-title" className="w-100">Overview</h2>
        {/*generate summary items*/
        props.summaryLabels.map((data) => {
            return(
                <div className="summary-row d-flex align-items-center justify-content-between">
                    <p className="row-label">{data.label}</p>
                    <div className="flex-grow-1">
                        
                    </div>
                </div>
            )
        })}
        <div className="summary-row">  
            <SearchBar 
                placeholder = {props.searchPlaceholder}
                onClick = {props.onClick}
                searchInput = {props.searchInput}
                onChange = {props.onChange}
                searchType = {props.searchType}
                id = {props.searchInputId}
                searchResults = {props.searchResults}
                label = {"New " + props.searchType[0].toUpperCase()+props.searchType.substring(1) }
                className = {"d-flex align-items-center summary-search justify-content-between"}
            />
        </div>
        
    </div>
    )
}
export default DashboardSummary