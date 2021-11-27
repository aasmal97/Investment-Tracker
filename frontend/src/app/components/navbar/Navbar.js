import NavToggler from './NavTogglerBtn';
import NavItem from '../navItems/NavItems';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function Navbar(props) {
    const [toggled, setToggled] = useState(false);
    const [togglerDisabled, setTogglerDisabled] = useState(false);
    const {currentUser, logout} = useAuth()
    const [error, setError] = useState("")
    const navigate = useNavigate()

    // Every time "disabled" changes, runs this callback.
    useEffect(() => {
        setTimeout(() => setTogglerDisabled(false), 160)
    }, [togglerDisabled]);

    const handleTogglerClick = () => {
        setToggled(currToggled => !currToggled);
        setTogglerDisabled(true);
    }
    const handleLogout = async () =>{
        try {
            await logout()
            navigate("/login")
        }catch{
            setError("Failed to sign out")
        }   
    }
    const handleLogin = () =>{
        navigate("/login")
    }
    
    return (
        <>
        <div className="navbar-expand-lg fixed-top">
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
                                    styles ={"navbar-anchor-link"}
                                    textContent={"About"} 
                                />
                                <NavItem 
                                    styles ={"navbar-anchor-link"}
                                    textContent={"Help"} 
                                />
                                <NavItem 
                                    btn = {true}
                                    styles ={"navbar-authenticate-btn"}
                                    textContent={currentUser ? "Log out" : "Sign In"}
                                    onClick = {currentUser ? handleLogout : handleLogin}
                                />
                            </div>
                        </div>
                    </div>
                </nav>
                {error && 
                    <div className="navbar-sign-out-error d-flex align-items-center alert alert-danger w-100"> 
                        <p className=" d-flex justify-content-center flex-grow-1 m-0">{error}</p>
                        <button 
                            type="button"
                            aria-label="close-message"
                            onClick = {() => setError("")}
                        >
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>
                    </div>
                }
        </div>
        </>
    )
}
