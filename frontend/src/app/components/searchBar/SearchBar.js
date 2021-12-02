import {faChartLine} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const SearchBar = (props) =>{
    return (
        <div className={`${props.className? props.className+" ":""}mb-4`}>
            <label 
                htmlFor={props.id} 
                className="form-label">
                   {props.label}
            </label>
            <div className="input-group"> 
                <input 
                    type="text" 
                    className="form-control" 
                    id={props.id} 
                    placeholder={props.placeholder}
                    onChange = {props.onChange}
                    value = {props.searchInput}
                />
                <button
                    id="stock-search-btn"
                    type="button"
                    data-search-type = "stock"
                    className = {`btn btn-${props.searchType === "stock" ? "secondary" : "dark"}`}
                    aria-label={"search-stock"}
                    onClick = {props.onClick}
                >
                    <FontAwesomeIcon icon= {faChartLine}/>
                </button>
                <button
                    id = "crypto-search-btn"
                    type="button"
                    data-search-type ="crypto"
                    className = {`btn btn-${props.searchType === "crypto" ? "secondary" : "dark"}`}
                    aria-label={"search-crypto"}
                    onClick = {props.onClick}
                >
                    <FontAwesomeIcon icon= {faBitcoin}/>
                </button>
            </div>
        </div>)
}
export default SearchBar