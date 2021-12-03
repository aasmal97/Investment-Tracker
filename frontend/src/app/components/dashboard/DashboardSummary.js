import SearchBar from "../searchBar/SearchBar";

const DashboardSummary = (props) =>{
    return (
    <div className="dashboard-summary-data"> 
        <h2 id="dashboard-summary-title" className="w-100">Overview</h2>
        {/*generate summary items*/
        props.summaryLabels.map((data) => {
            return(
                <div key={data.label} className="summary-row d-flex align-items-center justify-content-between">
                    <p className="row-label">{data.label}</p>
                    <div className="flex-grow-1 row-data">
                        <p>{data.value}</p>
                    </div>
                </div>
            )
        })}
        <div className="summary-row">  
            <SearchBar
                searchBarAdd = {true} 
                label = {"Add " + props.searchType[0].toUpperCase()+props.searchType.substring(1) }
                className = {"d-flex align-items-center summary-search justify-content-between"}
                {...props}
            />
            
            {//generate from of selected investments
            props.selectedInvestments.length !== 0 ? 
                <form onSubmit = {props.onSaveInvestSubmit}>
                    {props.selectedInvestments.map((investment) =>{
                        return (
                            <div 
                                key={investment.symbol}
                            >
                                <h3>{investment.name}</h3>
                            </div>
                        )
                    })}
                    <button>

                    </button>
                </form>
            :null}
        </div>
        
    </div>
    )
}
export default DashboardSummary