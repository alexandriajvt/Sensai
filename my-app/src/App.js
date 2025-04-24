import './App.css';
import React from 'react';
<<<<<<< HEAD
import CalendarPage from './CalendarPage';
import ExplorePage from './ExplorePage';
import EventDetailsPage from './EventDetailsPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import HomePage from './HomePage';
import MainNavBar from './components/Navbar';
import { Routes, Route } from "react-router-dom";
import ''

console.log('App component is rendering');
console.log("App is rendering. Current route:", window.location.pathname);

=======
import CalendarPage from './pages/CalendarPage';
import ExplorePage from './pages/ExplorePage';
//import EventDetailsPage from './pages/EventDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from "./pages/SignInPage";
import LogOutPage from "./pages/LogOutPage";
import EventPage from './pages/EventPage';
import MainNavBar from './components/Navbar';
import {Routes, Route,} from "react-router-dom";
//import RequireAuth from '@auth-kit/react-router/RequireAuth';
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> alexDev


function App() {
  return (
    <div> 
<<<<<<< HEAD
      <MainNavBar /> {/* Navbar appears on all pages */}
      <Routes>
        <Route path="/" element={<ProfilePage />} /> {/* ProfilePage loads first */}
        <Route path="/home" element={<HomePage />} /> {/* Optional: Keep HomePage accessible */}
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
=======
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
          </Route>
        </Routes>
>>>>>>> alexDev
    </div>  
  );
}
export default App;
