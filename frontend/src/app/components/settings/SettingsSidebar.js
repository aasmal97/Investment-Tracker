import SettingBtns from "./SettingBtns"
const SettingsSiderbar = ({currentOptions, onSettingClick, settingSelected, mobileWindowWidth}) =>{
    return (
    <div className={`settings-sidebar ${!mobileWindowWidth ?"mobile d-flex justify-content-center": ""}`}>
        {mobileWindowWidth?
            <div className="settings-btn-container">
                {currentOptions.map((setting, index) =>{
                    return (
                    <SettingBtns 
                        key = {setting.content}
                        id= {"setting-" + setting.content.toLowerCase()}
                        ariaLabel= {setting.content.toLowerCase()}
                        onClick = {onSettingClick}
                        selectedName= {"selected"}
                        settingSelected = {settingSelected}
                        btnContent = {setting.content}
                        index = {index}
                        icon = {setting.icon}
                    />
                )})}
                <div className={`empty-setting-sidebar-item ${!settingSelected.bottom? "selected-bottom":''}`}></div>
            </div>
        : 
        <div className = "settings-btn-container-mobile d-flex justify-content-center">
            {currentOptions.map((setting, index) =>{
                let last = index === currentOptions.length-1
                let first = index === 0
                return (
                <SettingBtns 
                    className ={`${last ? "last-item": ""} ${first ? "first-item": ""}`}
                    key = {setting.content}
                    id= {"setting-" + setting.content.toLowerCase()}
                    ariaLabel= {setting.content.toLowerCase()}
                    onClick = {onSettingClick}
                    selectedName= {"selected"}
                    settingSelected = {settingSelected}
                    btnContent = {setting.content}
                    index = {index}
                    icon = {setting.icon}
                />
            )})}
        </div>
        }
    </div>
    )
}
export default SettingsSiderbar