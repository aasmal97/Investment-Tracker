import { useAuth } from "../../../contexts/AuthContext"
import { useState} from "react"
import { Link } from "react-router-dom"
const Login = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const {resetPassword} = useAuth()
    const handleSubmit = async (e) =>{
        //prevent form from refreshing
        e.preventDefault()
      
        try{
            //login
           setError("")
           setLoading(true)
           await resetPassword(email)
           //reset password succeeded
           setMessage(`Check ${email} to get back on track! No pun intended. Note: It may take up to 5 minutes to recieve your reset email.`)
        } catch{
            //rest password failed
            setError("Failed to reset password. Try again in 5 mins")
        }
        //restore btn and function since await was already called once
        //this is to prevent multiple password resets
        setLoading(false)
    }
    return(
        <div className="log-in-form-container d-flex flex-column justify-content-center align-items-center">
            <form className="log-in-form" onSubmit={handleSubmit}>
                <div className="w-100 d-flex justify-content-center mb-1"><h1>Reset Password</h1></div>
                {message && <div className="mb-1 d-flex reset-success"><div className ="alert alert-success w-100" role="alert">{message}</div></div>}
                {error && <div className="mb-1 d-flex reset-error"><div className ="alert alert-danger w-100" role="alert">{error}</div></div>}
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
                <div className="d-flex justify-content-center">
                    <button 
                        disabled = {loading}
                        type="submit" 
                        className="btn btn-primary w-100 mt-2 mb-3" 
                        aria-label={"submit"}
                    >
                            Send Reset Email
                    </button>
                </div>

                <div className="w-100 text-center mt-3 mb-2"> <Link to="/login">Login</Link></div>
                <div className="w-100 text-center mt-4 mb-2"> Need an account? <Link to="/signup">Sign up</Link></div>
            </form>
        </div>
    )
}
export default Login
