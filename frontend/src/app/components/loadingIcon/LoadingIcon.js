const LoadingIcon = ({entireViewport = false, bgColor=null}) =>{
    return (
        <div 
            className={`loading-icon-container ${entireViewport ?"fill-viewport":""}`}
            style = {{backgroundColor :  bgColor}}
        >
            <div className="loading-icon" aria-label="loading"></div>
        </div>
    )
}
export default LoadingIcon