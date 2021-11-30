import {faSearch} from '@fortawesome/free-solid-svg-icons'
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
                />
                <button
                    type="button"
                    className = "btn btn-secondary"
                    aria-label={"search"}
                    onClick = {props.onClick}
                >
                    <FontAwesomeIcon icon= {faSearch}/>
                </button>
            </div>
        </div>)
}
export default SearchBar