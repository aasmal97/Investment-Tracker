import instagram from "../../../images/icons/Instagram.svg" 
import facebook from "../../../images/icons/Facebook.svg"
import github  from "../../../images/icons/Github.svg"
import {Link} from "react-router-dom"


const Footer = ({
    windowWidth,
}) =>{
    const circleSpacer = <svg
        className="footer-circle-spacer"
        viewBox = "0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="5" cy="5" r="4" />
    </svg>
    //Automates changing year
    let d = new Date()
    let time = d.getFullYear()
    return(
        <footer>
            <div className="footer-container">
                <div className="footer-social-media">
                    <div>Interested in other projects?</div>
                    <div className="footer-social-media-images">
                        <a
                            href="https://www.facebook.com/arky.asmal"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <img src={facebook} alt="facebook icon"/>
                        </a>
                        <a
                            href="https://www.instagram.com/arksauce/?hl=en"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <img src={instagram} alt="instagram icon"/>
                        </a>
                        <a
                            href="https://github.com/aasmal97"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <img src={github} alt="github icon"/>
                        </a>    
                    </div>
                </div>
                <div className="footer-additional-links">
                    <Link 
                        to = {"/about"}
                    >
                        About
                    </Link>
                    {circleSpacer}
                    <a
                        href="mailto:arkyasmal@gmail.com"
                    >
                        Contact
                    </a>
                </div>
                <div className="footer-app-use-policies">
                    <Link to = {"/termsOfUse"}>
                        Terms of Use
                    </Link>
                    {circleSpacer}
                    <Link to={"/privacyPolicy"}>
                        Privacy Policy
                    </Link>
                </div>
                <div className="footer-bottom">
                    <span className="footer-copyright">
                        © FinTrack {time}
                    </span>
                    <div className="footer-source-code">
                        Code: 
                        <a
                            href="https://github.com/aasmal97/Investment-Tracker"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            https://github.com/aasmal97/Investment-Tracker
                        </a>    
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer
