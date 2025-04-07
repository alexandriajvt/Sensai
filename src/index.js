import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import AuthProvider from "react-auth-kit";
//import AuthProvider from "react-auth-kit"; //DEFAULT EXPORT so default import
import createStore from 'react-auth-kit/createStore';
import 'bootstrap/dist/css/bootstrap.min.css';
//import { AUTH_CONFIG } from './constants';


// const authStore = createStore({
//   ...AUTH_CONFIG, //// Spread all shared settings
//   authType: 'cookie', //// Add store-specific ones
// });

const testStore = createStore({
  authName: 'test_auth',
  authType: 'localstorage' // Simpler than cookies
});

console.log('Auth store created:', testStore); // Should log an object

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*<AuthProvider store ={authStore} {...AUTH_CONFIG}>*/}
    <AuthProvider store = {testStore}>
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
