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


const store = createStore({
  authType: 'cookie',
  authName: '_auth',
  cookieDomain: window.location.hostname,
  cookieSecure: false // Set to true in production
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <AuthProvider store = {store}>
          <App />
      </AuthProvider>
    </BrowserRouter>
</React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
