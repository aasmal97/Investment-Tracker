import LoadingIcon from '../loadingIcon/LoadingIcon';
import {far} from '@fortawesome/free-regular-svg-icons';
import {library } from '@fortawesome/fontawesome-svg-core';
import {faSadCry, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(far, faSadCry)

const SearchDropdown = ({
    searchType,
    searchResults,
    onAddInvestClick,
    searchBarAdd,
    searchBarMinus,
    minus
}) =>{
    return (
        <div
            id="search-investments-dropdown"
            className="search-investments-dropdown"
        >
            <div className="d-flex justify-content-between w-100 align-items-center search-dropdown-titles">
                <div className="w-25 h-100" >Ticker Symbol</div>
                <div className="w-50 h-100" >{searchType ==="crypto" ? "Coin Name": "Company Name"}</div>
            </div>
            
            {searchResults.status === "failed" ?
                <div className="h-100 w-100 d-flex align-items-center justify-content-center">
                    <div className="alert alert-danger">Something went wrong. <FontAwesomeIcon icon={["far", "sad-cry"]} /> Try again in 10 mins</div>
                </div>
            : searchResults.status === "loading" ?
                <LoadingIcon/>
            : searchResults.results.map((investment) =>{
                const name = searchType==="crypto" ? "coinName" : "description"
                const symbol = searchType==="crypto" ? "symbol" : "symbol"
                const id = searchType === "crypto" ? "_id" : "symbol"
                return(
                    <button 
                        key={investment[id]}
                        className = "d-flex justify-content-between w-100 align-items-center"
                        aria-label = "select-investment"
                        onClick = {onAddInvestClick}
                        data-name= {investment[name]}
                        data-ticker= {investment[symbol]}
                    >
                        <div className="w-25">{investment[symbol]}</div>
                        <div className="w-50">
                            {searchType === "crypto" ? investment[name] : `${investment[name]} (${investment.type})`}
                        </div>
                        {searchBarAdd || searchBarMinus ? 
                            <div className="btn btn-success m-0 p-0 search-action-btn d-flex align-items-center justify-content-center">
                                <FontAwesomeIcon icon={minus ? faMinus: faPlus}/>
                            </div>
                        :null}
                    </button>
                )
            })}
        </div>
    )
}
export default SearchDropdown