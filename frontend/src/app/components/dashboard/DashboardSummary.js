import SearchBar from "../searchBar/SearchBar";

const DashboardSummary = (props) =>{
    return (<div className="dashboard-summary-data w-100"> 
        <SearchBar 
            placeholder = {props.searchPlaceholder}
            onClick = {props.onClick}
            searchInput = {props.searchInput}
            onChange = {props.onChange}
            searchType = {props.searchType}
        />
    </div>)
}
export default DashboardSummary