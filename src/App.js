import './App.css';
import React from 'react';
import CalendarPage from './pages/CalendarPage';
import ExplorePage from './pages/ExplorePage';
import EventDetailsPage from './pages/EventDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from "./pages/SignInPage";
import MainNavBar from './components/Navbar';
import {Routes, Route,} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
//import AuthOutlet from '@auth-kit/react-router/AuthOutlet'
//import RequireAuth from '@auth-kit/react-router/RequireAuth';
import RequireAuth from '@auth-kit/react-router/RequireAuth';
import { useContext } from "react";
import AuthContext from "react-auth-kit";


console.log('App component is rendering');
console.log("RequireAuth:", RequireAuth);
console.log("ProtectedRoute:", ProtectedRoute);

console.log(RequireAuth);
//console.log(AuthOutlet)
//          <Route path="/calendar"element={<RequireAuth fallbackPath="/signIn"><CalendarPage /></RequireAuth>}/>



/*
function App() {
  const authContext = useContext(AuthContext); // Use the context inside the component

  console.log("AuthContext:", authContext); // Log the context here to debug
  return (
    <div> 
        <MainNavBar /> {/* Navbar appears on all pages }
        <Routes>
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/calendar"element={<RequireAuth fallbackPath="/signIn"><CalendarPage /></RequireAuth>}/>
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
    </div>  
  );
}
*/

function App() {
  const authContext = useContext(AuthContext); // Use the context inside the component

  console.log("AuthContext:", authContext); // Log the context here to debug
  return (
    <div> 
        <MainNavBar /> {/* Navbar appears on all pages */}
          <Routes>
            <Route path="/" element={<CalendarPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/event/:id" element={<EventDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
    </div>  
  );
}

export default App;
