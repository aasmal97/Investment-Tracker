
const NavItem = ({sidebar=false, url=false, onClick, btn=false, textContent, styles=false, hidden="false"}) =>{  
    return (
        <>
            {sidebar ? 
                //when btn parameter is not provided, we default to links
                //if not we provide a button 
                //both accept custom classes
                !btn ? 
                    <div
                        className={`${sidebar === "primary" ? "primary":"secondary"}-sidebar-link ${styles? styles:""}`} 
                        aria-label={textContent}
                        aria-hidden = {hidden}
                        tabIndex={`${hidden ? "-1":"0"}`}
                        onClick = {onClick}
                    >
                            <span>{textContent}</span>
                    </div>
                :
                    <button
                        className={styles ? styles : ""}
                        aria-label={textContent}
                        aria-hidden = {hidden}
                        tabIndex={`${hidden ? "-1":"0"}`}
                        onClick = {onClick}
                    >
                        <span>{textContent}</span>
                    </button>
            : !btn ? 
                <div 
                    className={`nav-anchor-link home-page-nav mx-1 ${styles ? styles : ""}`} 
                    aria-label={textContent}
                    aria-hidden = {hidden}
                    tabIndex={`${hidden ? "-1":"0"}`}
                    onClick = {onClick}
                >
                    <span>{textContent}</span>
                </div>

                :<button 
                    className={`nav-btn home-page-nav mx-1 ${styles ? styles : ""}`} 
                    aria-label={textContent}
                    aria-hidden = {hidden}
                    tabIndex={`${hidden ? "-1":"0"}`}
                    onClick = {onClick}
                >
                        <span>{textContent}</span>
                </button>
            }
        </>
    )
}
export default NavItem