import LoadingIcon from "../loadingIcon/LoadingIcon"
const SelectInvestmentsForm = ({
    onSaveInvestSubmit,
    selectionsSubmitted,
    onDeleteInvestClick,
    onAddInvestFormChange,
    selectedInvestments
}) =>{
    return(
        <form 
            id={"dashboard-summary-selected-form"}
            onSubmit = {onSaveInvestSubmit}
            className="d-flex flex-column"
        >
             {selectionsSubmitted ? 
                <div className="dashboard-summary-selected-form-loading">
                    <LoadingIcon light={true}/>
                </div>
            : null}
            <h2 
                id={"dashboard-summary-selected-title"} 
                className="w-100">
                    Selected Investments
            </h2>
            <div className="w-100 dashboard-add-invest-container">
                {selectedInvestments.map((investment, index) =>{
                    return (
                        <div 
                            key={investment.symbol+" "+investment.investmentType}
                            className = "dashboard-add-invest-row-item d-flex align-items-end justify-content-between"
                        >
                            <div className="h-100">
                                <button 
                                    type="button" 
                                    aria-label="delete" 
                                    className="btn btn-danger row-item-delete-btn"
                                    onClick = {onDeleteInvestClick}
                                    data-symbol={investment.symbol}
                                    data-index={index}
                                >
                                    Delete
                                </button>
                                <h3>
                                    {`${investment.name} (${investment.symbol})`}
                                </h3>
                            </div>
                            
                            <div>
                                <label 
                                    htmlFor={investment.symbol+" "+investment.investmentType} 
                                    className="form-label w-100">Amount Owned (USD)</label>
                                <input 
                                    id={investment.symbol+" "+investment.investmentType}
                                    value={investment.investedAmount} 
                                    onChange ={onAddInvestFormChange} 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="100, 100.23, etc"
                                    data-symbol={investment.symbol}
                                    data-index={index}
                                    required
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
            <button
                type="submit"
                aria-label="save investments"
                className="btn btn-primary mt-3 mb-2 align-self-center"
                id="selected-invest-form-save-btn"
                disabled = {selectionsSubmitted}
            >
                Save
            </button>
        </form>
    )
}
export default SelectInvestmentsForm