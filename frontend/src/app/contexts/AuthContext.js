import React, { useContext, useEffect } from "react";
import { useState } from "react";
import app from "../../firebase"
import axios from 'axios';
import {
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail
} from 'firebase/auth'

const AuthContext = React.createContext()
const auth = getAuth(app)
const backendAPI = process.env.REACT_APP_BACKEND_API
export function AuthProvider({children}) {
    //hold info on current user
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    async function signup (email, password, firstName, lastName){
        return createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) =>{
            const user = userCredential.user
            const userData = {
                uid: user.uid,
                firstName: firstName,
                lastName: lastName,
                metadata: user.metadata,
                emailVerified: user.emailVerified,
                email: user.email
            }
            axios.post(backendAPI+"/user", userData)
            .then((res) => res.data).catch(error => error)
        })
        .catch((error) =>{
            const errorCode = error.code;
            return errorCode
        })
    }

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
        .catch((error) =>{
            const errorCode = error.code;
            return errorCode
        })
    } 
    function logout(){
        return signOut(auth)
    }
    function resetPassword (email) {
        return sendPasswordResetEmail(auth, email)
    }
    //whenever user changes, this is automatically called and our state is 
    //updated with current user
    //we only want this upon application mount! 
    // We dont want it listening even after user signs up/login
    useEffect(() =>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    }, [])
    

    //will tell us which user is logged in.
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword
    }

    return(
        <AuthContext.Provider value = {value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}