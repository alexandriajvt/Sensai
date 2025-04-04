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
import { RequireAuth } from "react-auth-kit";
//import RequireAuth from '@auth-kit/react-router/RequireAuth';
console.log('App component is rendering');

function App() {
  return (
    <div> 
        <MainNavBar /> {/* Navbar appears on all pages */}
        <Routes>
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/calendar"element={<RequireAuth fallbackPath="/signin"><CalendarPage /></RequireAuth>}/>
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
    </div>  
  );
}

export default App;
