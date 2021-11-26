const GeneralSettings = (props) =>{
    return(
        <>
        <div className="w-100">
            <div className="mb-3 d-flex justify-content-between">
                    <div className="me-1 setting-current-input-container w-100">
                        <label htmlFor="first-name" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="first-name" placeholder=""/>
                    </div>
                    <div className="ms-1 setting-current-input-container w-100">
                        <label htmlFor="last-name" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="last-name" placeholder=""/>
                    </div>
                </div>
                <div className="mb-3 d-flex">
                    <div className="setting-current-input-container-row w-100">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder=""/>
                    </div>
                </div>
                <div className="mb-3 d-flex">
                    <div className="setting-current-input-container-row w-100">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" placeholder=""/>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-danger" aria-label={"delete-account"}>Delete Account</button>
                </div>
        </div>
            
        </>
    )
}
export default GeneralSettings