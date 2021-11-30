import {faTimes} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SearchBar from "../searchBar/SearchBar"
const InvestmentSettings = (props) =>{
    return(
        <div className="setting-investments-container w-100">
            <h1 className ="mb-3">Your Investments</h1>
                <SearchBar
                    id={"search-investments"} 
                    label = {"Add Investment"}
                    className = {"settings-add-new-investments"}
                />
            <h2 className="mb-3">Untrack Investments</h2>
            {props.userInfo.tracked_investments.map((investment, index)=>{
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