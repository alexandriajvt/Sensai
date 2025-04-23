import './App.css';
import React from 'react';
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



function App() {
  return (
    <div> 
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
    </div>  
  );
}

export default App;
