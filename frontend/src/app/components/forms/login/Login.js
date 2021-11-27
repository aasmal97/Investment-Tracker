import { useAuth } from "../../../contexts/AuthContext"
import { useState} from "react"
import { Link, useNavigate } from "react-router-dom"
const Login = () => {
   
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {login} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e) =>{
        //prevent form from refreshing
        e.preventDefault()
        //password is wrong       
        try{
            //login
           setError("")
           setLoading(true)
           await login(email, password)
           //when signin successful
           navigate("/dashboard")
        } catch{
            //Login failed
            setError("Failed to sign in")
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
