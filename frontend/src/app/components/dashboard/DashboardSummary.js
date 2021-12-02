import SearchBar from "../searchBar/SearchBar";

const DashboardSummary = (props) =>{
    return (
    <div className="dashboard-summary-data w-100"> 
        <div><p>Current Investment Total:</p></div>
        <div><p>Top Performing Stock:</p><p>(In Portfolio)</p></div>
        <div><p>Lifetime Cash Invested: </p></div>
        <div><p>Lifetime Growth: </p></div>
        <div><p>Yearly Change: </p><p>{}</p></div>
        
        <div></div>
        <div className="d-flex w-100">
            <p>Add New Investment</p>
            <SearchBar 
                placeholder = {props.searchPlaceholder}
                onClick = {props.onClick}
                searchInput = {props.searchInput}
                onChange = {props.onChange}
                searchType = {props.searchType}
                id = {props.searchInputId}
                searchResults = {props.searchResults}
            />
        </div>
        <div><p>Delete Investment</p></div>
        
    </div>
    )
}
export default DashboardSummary