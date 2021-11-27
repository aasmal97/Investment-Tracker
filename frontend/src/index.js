import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import store from './redux/store';
import { AuthProvider } from './app/contexts/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
