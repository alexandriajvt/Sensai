import './App.css';
import React from 'react';
import CalendarPage from './pages/CalendarPage';
import EventDetailsPage from './pages/EventDetailsPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import {Routes, Route,} from "react-router-dom";
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
console.log('App component is rendering');

function App() {
  return (
    // <div className="App">
    //   <h1>App is rendering!</h1> {/* Check if this appears */}
    //   <CalendarPage />
    <div> 
      <Navbar /> {/* Navbar appears on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />
      </Routes>
    </div>  
  );
}

export default App;
