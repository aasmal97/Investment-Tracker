import { useAuth } from "../../../contexts/AuthContext"
import { useState } from "react"
import { Link } from "react-router-dom"
const Signup = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const {signup} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    
    const handleSubmit = async (e) =>{
        //prevent form from refreshing
        e.preventDefault()
        //password dont match
        if(password !== passwordConfirm) return setError("Passwords do not match")
        
        try{
            //signup
           setError("")
           setLoading(true)
           await signup(email, password, firstName, lastName)
        } catch{
            //signup failed
            setError("Failed to create an account")
        }
        //restore btn and function since await was already called once
        //this is to prevent multiple account creations
        setLoading(false)
    }
    return(
        <div className="sign-up-form-container d-flex flex-column justify-content-center align-items-center">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <div className="w-100 d-flex justify-content-center"><h1>Sign Up</h1></div>
                {error && <div className="mb-3 d-flex sign-up-error"><div className ="alert alert-danger w-100" role="alert">{error}</div></div>}
                <div className="mb-3 d-flex justify-content-between">
                    <div className="me-1 setting-current-input-container w-100">
                        <label htmlFor="first-name" className="form-label">First Name</label>
                        <input 
                            value={firstName} 
                            onChange = {e=>setFirstName(e.target.value)} 
                            type="text" 
                            className="form-control" 
                            id="first-name" 
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="ms-1 setting-current-input-container w-100">
                        <label htmlFor="last-name" className="form-label">Last Name</label>
                        <input 
                            value={lastName}  
                            onChange = {e=>setLastName(e.target.value)} 
                            type="text" 
                            className="form-control" 
                            id="last-name" 
                            placeholder=""
                            required
                        />
                    </div>
                </div>
                <div className="mb-3 d-flex">
                    <div className="setting-current-input-container-row w-100">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            value={email} 
                            onChange = {e=>setEmail(e.target.value)} 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder=""
                            required
                        />
                    </div>
                </div>
                <div className="mb-3 d-flex">
                    <div className="setting-current-input-container-row w-100">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            value={password}  
                            onChange = {e=>setPassword(e.target.value)} 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            placeholder=""
                            required
                        />
                    </div>
                </div>
                <div className="mb-3 d-flex">
                    <div className="setting-current-input-container-row w-100">
                        <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                        <input 
                            value={passwordConfirm} 
                            onChange = {e=>setPasswordConfirm(e.target.value)} 
                            type="password" 
                            className="form-control" 
                            id="confirm-password" 
                            placeholder=""
                            required
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-4 mb-3">
                    <button 
                        disabled = {loading}
                        type="submit" 
                        className="btn btn-primary w-100" 
                        aria-label={"submit"}
                    >
                            Sign Up
                    </button>
                </div>
                <div className="w-100 text-center mt-4 mb-1"> Already have an account? <Link to="/login">Log In</Link></div>
            </form>
        </div>
    )
}
export default Signup