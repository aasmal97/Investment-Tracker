const SettingBtns = ({id, ariaLabel, onClick, className="", selectedName, settingSelected, btnContent, index, isLast, icon = null}) =>{
    return (
        <button 
            id={id} 
            data-btn-index={index}
            className={`${className} ${settingSelected.curr === id?selectedName:''} ${settingSelected.top === id?selectedName + "-top":''} ${settingSelected.bottom === id?selectedName + "-bottom":''} ${isLast? "last-item":''}`} 
            aria-label={ariaLabel}
            onClick = {onClick}
            onKeyDown={onClick}
        >
            {icon}
            <span>{btnContent}</span>
        </button>
    )
}
export default SettingBtns