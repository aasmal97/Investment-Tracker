import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowDown, faBars} from '@fortawesome/free-solid-svg-icons' 

//Button Components
const NavToggler = (props) => {

    return (
        <button
            disabled={props.togglerDisabled}
            id="nav-toggler"
            className="container-fluid navbar-toggler home-page-nav"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="true"
            aria-label="Toggle navigation"
            onClick={props.handleTogglerClick}
        >
            <span id="nav-icon" className={`home-page-nav`}> 
                {!props.btnToggled?
                    <FontAwesomeIcon icon={faBars}/>
                    :  <FontAwesomeIcon icon={faArrowDown}/>
                }
            </span>
        </button>
    )
}
export default NavToggler