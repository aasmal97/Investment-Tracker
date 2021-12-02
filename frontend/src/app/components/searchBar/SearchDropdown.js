import LoadingIcon from '../loadingIcon/LoadingIcon';
import {far} from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import {faSadCry} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(far, faSadCry)

const SearchDropdown = (props) =>{
    return (
        <div
            id="search-investments-dropdown"
            className="search-investments-dropdown"
        >
            <div className="d-flex justify-content-between w-100 align-items-center search-dropdown-titles">
                <div className="w-25 h-100" >Ticker Symbol</div>
                <div className="w-50 h-100" >{props.searchType ==="crypto" ? "Coin Name": "Company Name"}</div>
            </div>
            
            {props.searchResults.status === "failed" ?
                <div className="h-100 w-100 d-flex align-items-center justify-content-center">
                    <div className="alert alert-danger">Something went wrong. <FontAwesomeIcon icon={["far", "sad-cry"]} /> Try again in 10 mins</div>
                </div>
            : props.searchResults.status === "loading" ?
                <LoadingIcon/>
            : props.searchResults.results.map((investment) =>{
                const name = props.searchType==="crypto" ? "coinName" : "description"
                const symbol = props.searchType==="crypto" ? "symbol" : "symbol"
                const id = props.searchType === "crypto" ? "_id" : "symbol"
                return(
                    <button 
                        key={investment[id]}
                        className = "d-flex justify-content-between w-100 align-items-center"
                        aria-label = "select-investment"
                        onClick = {props.onClick}
                    >
                        <div className="w-25">{investment[symbol]}</div>
                        <div className="w-50">{props.searchType === "crypto" ? investment[name] : `${investment[name]} (${investment.type})` }</div>
                    </button>
                )
            })}
        </div>
    )
}
export default SearchDropdown