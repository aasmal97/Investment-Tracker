import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoadingIcon from './components/loadingIcon/LoadingIcon';
import NavWrapper from "./components/navbar/NavWrapper"
import { useAuth } from './contexts/AuthContext';

//lazy loaded components for performance
const Settings = React.lazy(() => import('./components/settings/Settings'))
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'))
const SignUp = React.lazy(() => import('./components/forms/signUp/Signup'))
const Login = React.lazy(() => import('./components/forms/login/Login'))
const ResetPassword = React.lazy(() => import('./components/forms/login/ResetPassword'))

function App() {
  const {currentUser} = useAuth()
  return (
    <Router>
      <div className="App">
        <Suspense fallback={
          <LoadingIcon entireViewport={true} />
        }>

            <Routes>
                <Route
                  exact path="/signup"
                  element={
                    <NavWrapper>
                      <SignUp/>
                    </NavWrapper>
                  }
                /> 
                <Route
                  exact path="/login"
                  element={
                    <NavWrapper>
                      <Login/>
                    </NavWrapper>
                  }
                /> 
                <Route
                  exact path="/resetPassword"
                  element={
                    <NavWrapper>
                      <ResetPassword/>
                    </NavWrapper>
                  }
                /> 
                <Route
                  exact path="/dashboard"
                  element={currentUser ? <NavWrapper><Dashboard/></NavWrapper> : <Navigate to="/login"/>}
                />
        
                <Route
                  exact path="/settings"
                  element={
                    <NavWrapper>
                      <Settings/>
                    </NavWrapper>
                  }
                />    
            </Routes>
        </Suspense> 
      </div >
    </Router >
  );
}

export default App;
