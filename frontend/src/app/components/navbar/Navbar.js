import NavToggler from './NavTogglerBtn';
import NavItem from '../navItems/NavItems';
import { useState, useEffect } from 'react';
export default function Navbar(props) {
    const [toggled, setToggled] = useState(false);
    const [togglerDisabled, setTogglerDisabled] = useState(false);

    // Every time "disabled" changes, runs this callback.
    useEffect(() => {
        setTimeout(() => setTogglerDisabled(false), 160)
    }, [togglerDisabled]);

    const handleTogglerClick = () => {
        setToggled(currToggled => !currToggled);
        setTogglerDisabled(true);
    }
    return (
        <>
            <div 
                id="filter-navbar-container" 
                className="navbar-expand-lg fixed-top"
            >
                <nav 
                    id="navbar" 
                    className={`navbar home-page-nav navbar-expand-lg`}>
                    <a href="/" className="companyTitle">FinTrack</a>
                    <div className={`nav-toggler-${props.windowWidth ? "hide": "show"}`}>
                        <NavToggler 
                            handleTogglerClick={handleTogglerClick}
                            togglerDisabled = {togglerDisabled}
                            btnToggled = {toggled}
                        />
                    </div>    
                    
                    
                    <div id="navbarSupportedContent" className={`collapse navbar-collapse home-page-nav`}>
                        <div className= {`d-flex ${props.windowWidth ? "navbar-nav w-100 justify-content-end me-3" : "justify-content-center"}`}>
                            <div className={`${props.windowWidth ? "d-flex justify-content-end" : "d-flex flex-column w-50"} ${toggled && !props.windowWidth ? "mb-2":""}`}>
                                <NavItem 
                                    textContent={"About"} 
                                />
                                <NavItem 
                                    textContent={"Help"} 
                                />
                            </div>
                        </div>
                        {/* <div className="navbar-nav w-100 justify-content-end">
                            <div className="d-flex justify-content-end align-self-stretch px-1 m-0">
                                
                            </div>
                        </div> */}
                    </div>
                </nav>
            </div>
        </>
    )
}
