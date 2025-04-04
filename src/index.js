import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { AuthProvider} from "react-auth-kit";
import createStore from 'react-auth-kit/createStore';
import 'bootstrap/dist/css/bootstrap.min.css';



const store = createStore({//Initializes the authentication store with configurations for cookie storage.
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

//AuthProvider Wraps the application to provide authentication context. 
// It's crucial that AuthProvider wraps around BrowserRouter to ensure routing works correctly with authentication.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider store = {store}>
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
