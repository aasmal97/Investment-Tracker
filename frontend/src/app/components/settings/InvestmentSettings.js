import {faTimes, faSearch} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const InvestmentSettings = (props) =>{
    return(
        <div className="setting-investments-container w-100">
            <h1 className ="mb-3">Your Investments</h1>
            <div className="settings-add-new-investments mb-4">
                <label 
                    htmlFor="search-investment" 
                    className="form-label">
                        Add Investment
                </label>
                <div className="input-group"> 
                    <input 
                        type="text" 
                        className="form-control" 
                        id="search-investment" 
                        placeholder=""
                    />
                    <button
                        type="button"
                        className = "btn btn-secondary"
                        aria-label={"search"}
                    >
                        <FontAwesomeIcon icon= {faSearch}/>
                    </button>
                </div>
            </div>
            <h2 className="mb-3">Untrack Investments</h2>
            {props.userInfo.investments_tracked.map((investment, index)=>{
                return(
                    <div key={investment+index} className="settings-investment-row d-flex mb-3 justify-content-between align-items-center">
                        <p>{investment}</p>
                        <button 
                            className="btn btn-danger" 
                            aria-label={"remove-investment"}
                        >
                            <FontAwesomeIcon icon = {faTimes} /> 
                        </button> 
                    </div>
                )
            })}
        </div>
    )
}
export default InvestmentSettings