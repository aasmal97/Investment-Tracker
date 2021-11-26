import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {far} from '@fortawesome/free-regular-svg-icons'
import {faEnvelope, faChartLine, faCog, faRobot} from '@fortawesome/free-solid-svg-icons'
import useWindowWidth from '../../hooks/use-window-width'
import SettingsSidebar from "./SettingsSidebar"
import GeneralSettings from "./GeneralSettings"
import InvestmentSettings from "./InvestmentSettings"
import ContactSettings from "./ContactSettings"
library.add(far, faEnvelope,  faChartLine, faCog)

const Settings = () =>{
    const currentOptions = [
        {content:"General", icon:<FontAwesomeIcon icon={faCog}/>}, 
        {content:"Investments", icon:<FontAwesomeIcon icon={faChartLine}/>}, 
        {content: "Contact", icon: <FontAwesomeIcon icon={["far", "envelope"]}/>}
    ]
    //track btn selected
    const [settingSelected, setSettingSelected] = useState({
        curr: "setting-"+currentOptions[0].content.toLowerCase(), 
        top: null, 
        bottom: "setting-"+currentOptions[1].content.toLowerCase()
    })
    //track mobile width
    const mobileWindowWidth = useWindowWidth(576)
    //track any updates to userInfo
    const userInfo = useSelector((state) => state.userInfo)
    const dispatch = useDispatch()
    
    const onSettingClick = (e) =>{
        if(e.type ==="keydown" && e.key !== "enter") return
        const curr_btn = e.target.closest("button")
        const curr_btn_id = curr_btn.id
        const top_btn_index = parseInt(curr_btn.dataset.btnIndex) - 1
        const bottom_btn_index = parseInt(curr_btn.dataset.btnIndex) + 1
        let newState = {
            curr: curr_btn_id
        }
        //ensure null is passed is btn index does not exist
        if(top_btn_index < 0) newState["top"] = null
        else newState["top"] = "setting-"+currentOptions[top_btn_index].content.toLowerCase()
        if(bottom_btn_index > currentOptions.length-1) newState["bottom"] = null
        else newState["bottom"] = "setting-"+currentOptions[bottom_btn_index].content.toLowerCase()
        setSettingSelected(newState)  
    }
    console.log(userInfo, settingSelected)
    return(
        <div className={`overall-settings-container d-flex align-items-stretch ${!mobileWindowWidth? "flex-column justify-content-center":""}`}>
            
            <SettingsSidebar
                currentOptions = {currentOptions}
                onSettingClick = {onSettingClick}
                settingSelected = {settingSelected}
                mobileWindowWidth = {mobileWindowWidth}
            />
            
            <div className="settings-current-option-content align-self-center d-flex justify-content-center">
                
                <div className="setting-current-form-container w-100">
                    <div className="d-flex flex-column align-items-center w-100">
                        {userInfo.verifiedEmail ?
                            <> 
                                <div className="setting-un-verified-pop-up d-flex flex-column justify-content-center">
                                    <p className="mb-2">Please prove you are not a robot <FontAwesomeIcon icon={faRobot}/>, by verifying your email at {userInfo.email}</p>
                                    <p>Note: You may be unable to access all our features without doing so.</p>
                                </div> 
                            </>
                        :null}
                        {/* load default setting*/}
                        {settingSelected.curr === "setting-general" ? 
                            <GeneralSettings userInfo = {userInfo}/>
                        :settingSelected.curr ==="setting-investments"?
                            <InvestmentSettings userInfo = {userInfo}/>
                        : settingSelected.curr === "setting-contact"?
                            <ContactSettings userInfo ={userInfo}/>
                        : null}

                        <button
                            type="button" 
                            className="btn btn-primary justify-self-center mt-3 my-1" 
                            aria-label="save-changes"
                        > 
                            Save Changes
                        </button>
                    </div>
                
                </div>
            </div>    
        </div>
    )
}
export default Settings