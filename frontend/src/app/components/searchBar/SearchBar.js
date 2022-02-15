import {faChartLine} from '@fortawesome/free-solid-svg-icons';
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import SearchDropdown from "./SearchDropdown"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SearchBar = ({
    label, 
    id,
    searchPlaceholder,
    searchInput,
    searchResults,
    onSearchClick,
    className,
    onSearchChange,
    searchType,
    minus,
    onAddInvestClick,
    searchBarAdd,
    searchBarMinus
}) =>{
    return (
        <div className={`${className? className+" ":""}`}>
            <label 
                htmlFor={id} 
                className="form-label">
                   {label}
            </label>
            <div className="input-group search-bar"> 
                <input 
                    type="text" 
                    className="form-control" 
                    id={id} 
                    placeholder={searchPlaceholder}
                    onChange = {onSearchChange}
                    value = {searchInput}
                />
                {searchResults.status ? 
                    <SearchDropdown 
                        searchType = {searchType}
                        searchResults = {searchResults}
                        onAddInvestClick = {onAddInvestClick}
                        searchBarAdd = {searchBarAdd}
                        searchBarMinus = {searchBarMinus}
                        minus = {minus}
                    />
                : null}
                
                <button
                    id="stock-search-btn"
                    type="button"
                    data-search-type = "stock"
                    className = {`btn btn-${searchType === "stock" ? "secondary" : "dark"}`}
                    aria-label={"search-stock"}
                    onClick = {onSearchClick}
                >
                    <FontAwesomeIcon icon= {faChartLine}/>
                </button>
                <button
                    id = "crypto-search-btn"
                    type="button"
                    data-search-type ="crypto"
                    className = {`btn btn-${searchType === "crypto" ? "secondary" : "dark"}`}
                    aria-label={"search-crypto"}
                    onClick = {onSearchClick}
                >
                    <FontAwesomeIcon icon= {faBitcoin}/>
                </button>
            </div>
        </div>)
}
export default SearchBar