import instagram from "../../../images/icons/Instagram.svg" 
import facebook from "../../../images/icons/Facebook.svg"
import github  from "../../../images/icons/Github.svg"

//Automates changing year
let d = new Date()
let time = d.getFullYear()


const Footer = ({
    windowWidth,
}) =>{
    return(
        <footer>
            <div className="footer-container">
                <div className="footer-social-media">
                    <div>Interested in other projects?</div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg">
                            <image href={facebook}/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg">
                            <image href={instagram}/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg">
                            <image href={github}/>
                        </svg>
                    </div>
                </div>
                <div>

                </div>
                <div>

                </div>
                <div>

                </div>
            </div>
        </footer>
    )
}
export default Footer
// export default class Footer extends Component {
//     render() {
//         return (
//             <footer className="w-100"  id="footer">
//                 <div className="d-flex justify-content-center flex-wrap py-2">
//                     <div className="col-sm-3 col-12 text-center py-3">
//                         <h5>Visualum</h5>
//                         <div className="d-flex flex-column align-items-center">
//                             <a className="foot-link" href="#footer">For Teachers</a>
//                             <a className="foot-link" href="#footer">For Students</a>
//                             <a className="foot-link" href="#footer">For Enterprise</a>
//                         </div>
//                     </div>

//                     <div className="col-sm-3 col-12 text-center py-3">
//                         <h5>Social</h5>
//                         <div className="d-flex flex-column align-items-center">
//                             <a className="foot-link" href="#footer">LinkedIn</a>
//                             <a className="foot-link" href="#footer">Instagram</a>
//                             <a className="foot-link" href="#footer">Facebook</a>
//                         </div>
//                     </div>

//                     <div className="col-sm-3 col-12 text-center py-3">
//                         <h5>About</h5>
//                         <div className="d-flex flex-column align-items-center">
//                             <a className="foot-link" href="#footer">Terms</a>
//                             <a className="foot-link" href="#footer">Contact Us</a>
//                             <a className="foot-link" href="#footer">Meet the Team</a>
//                         </div>
//                     </div>
//                 </div>

//                 <div id="copyright" className="row">
//                     <div className="text-center">
//                         <p><i className="fa fa-copyright"></i> {time} Visualum All rights reserved </p>
//                     </div>
//                 </div>
//             </footer>

//         )
//     }
// }
