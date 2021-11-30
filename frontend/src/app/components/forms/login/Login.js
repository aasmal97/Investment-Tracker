import { useAuth } from "../../../contexts/AuthContext"
import { useState} from "react"
import { Link, useNavigate } from "react-router-dom"
const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {login, currentUser} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e) =>{
        //prevent form from refreshing
        e.preventDefault()
        //login
        setError("")
        setLoading(true)
        const response = await login(email, password)
        switch (response) {
            case "auth/invalid-email": 
                setError("Invalid Email")
                break;
            case "auth/user-disabled":
                setError("Your account is disabled")
                break;
            case "auth/user-not-found":
                setError("This account does not exist")  
                break;
            case "auth/wrong-password":
                setError("Wrong Password")
                break;
            case "auth/too-many-requests":
                setError("You have tried to login to many times. Try again in 5 mins")
                break;
            case currentUser:
                navigate("/dashboard")
                break;
            default:
                setError("An error has occured")
                break;
        }
        //restore btn and function since await was already called once
        //this is to prevent multiple account creations
        setLoading(false)
    }
    return(
        <div className="log-in-form-container d-flex flex-column justify-content-center align-items-center">
            <form className="log-in-form" onSubmit={handleSubmit}>
                <div className="w-100 d-flex justify-content-center"><h1>Log In</h1></div>
            {error && <div className="mb-1 d-flex log-in-error"><div className ="alert alert-danger w-100" role="alert">{error}</div></div>}
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
                <div className="d-flex justify-content-center">
                    <button 
                        disabled = {loading}
                        type="submit" 
                        className="btn btn-primary w-100 mt-2 mb-1" 
                        aria-label={"submit"}
                    >
                            Log In
                    </button>
                </div>
                <div className="w-100 text-center mt-2 mb-1"> Forgot Your Password? Reset it <Link to="/resetPassword">Here</Link></div>

                <div className="w-100 text-center mt-4 mb-1"> Need an account? <Link to="/signup">Sign Up</Link></div>
            </form>
        </div>
    )
}
export default Login