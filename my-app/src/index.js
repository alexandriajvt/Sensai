import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import AuthProvider from "react-auth-kit";
import createStore from 'react-auth-kit/createStore';
import 'bootstrap/dist/css/bootstrap.min.css';


const authStore = createStore({
  authName: '_auth',       // Cookie name (default: `_auth`)
  authType: 'cookie',      // Storage type (`cookie` or `localstorage`)
  cookieDomain: window.location.hostname,
  cookieSecure: false,     // `true` for HTTPS-only in production
});


console.log('Auth store created:', authStore); // Should log an object

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider store = {authStore}>
      <BrowserRouter>
          <App />
       </BrowserRouter>
    </AuthProvider>
</React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
