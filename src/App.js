import './App.css';
import React from 'react';
import CalendarPage from './pages/CalendarPage';
import ExplorePage from './pages/ExplorePage';
import EventDetailsPage from './pages/EventDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
import MainNavBar from './components/Navbar';
import {Routes, Route,} from "react-router-dom";
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
console.log('App component is rendering');

function App() {
  return (
    // <div className="App">
    //   <h1>App is rendering!</h1> {/* Check if this appears */}
    //   <CalendarPage />
    <div> 
      <MainNavBar /> {/* Navbar appears on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
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
