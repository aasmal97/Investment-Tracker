import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoadingIcon from './components/loadingIcon/LoadingIcon';
import NavWrapper from "./components/navbar/NavWrapper"
//lazy loaded components for performance
const Settings = React.lazy(() => import('./components/settings/Settings'))


function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={
          <LoadingIcon entireViewport={true} />
        }>
          <Routes>
              {/* <Route
                exact path="/"
                element={
                  
                }
              /> 
              <Route
                exact path="/signup"
                element={
                  
                }
              /> 
              <Route
                exact path="/login"
                element={
                  
                }
              /> 
              <Route
                exact path="/dashboard"
                element={
                  
                }
              />  */}
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
