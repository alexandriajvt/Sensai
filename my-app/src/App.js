import './App.css';
import React from 'react';
import CalendarPage from './pages/CalendarPage';
import ExplorePage from './pages/ExplorePage';
//import EventDetailsPage from './pages/EventDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from "./pages/SignInPage";
import LogOutPage from "./pages/LogOutPage";
import EventPage from './pages/EventPage';
import MainNavBar from './components/Navbar';
import EventApprovalPage from './components/EventApprovalComponent';
import {Routes, Route,} from "react-router-dom";
//import RequireAuth from '@auth-kit/react-router/RequireAuth';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <div> 
        <MainNavBar /> {/* Navbar appears on all pages */}
        <Routes>
          {/* Public Route for Sign-In */}
          <Route path="/" element={<SignInPage />} />
          <Route path="/login" element={<SignInPage />} />


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/explore" element={<ExplorePage/>} />
            <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/calendar" element={<CalendarPage/>} />
            <Route path="/logout" element={<LogOutPage/>} />
            <Route path="/events" element={<EventPage/>} />
            <Route path="/event-approval" element={<EventApprovalPage/>} />
          </Route>
        </Routes>
    </div>  
  );
}
export default App;
