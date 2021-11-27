import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from 'firebase/auth'
import app from "../../firebase"
const AuthContext = React.createContext()
const auth = getAuth(app)

export function AuthProvider({children}) {
    //hold info on current user
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    function signup (email, password){
        return createUserWithEmailAndPassword(auth, email, password)
    }
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
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