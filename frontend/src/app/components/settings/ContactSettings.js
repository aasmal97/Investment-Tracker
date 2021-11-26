const ContactSettings = (props) =>{
    return (
        <div className="setting-contact-settings w-100">
            <h1>Contact Settings</h1>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="settings-recieve-daily-updates" checked={true} readOnly/>
                <label className="form-check-label" htmlFor="settings-recieve-daily-updates">
                Recieve daily emails on tracked investments 
            </label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="recieve-new-feature-updates" checked={false} readOnly/>
                <label className="form-check-label" htmlFor="recieve-new-feature-updates">
                Recieve emails about new features
            </label>
            </div>
        </div>
    )
}
export default ContactSettings