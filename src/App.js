import './App.css';
import React from 'react';
import CalendarPage from './pages/CalendarPage';
import ExplorePage from './pages/ExplorePage';
//import EventDetailsPage from './pages/EventDetailsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from "./pages/SignInPage";
import MainNavBar from './components/Navbar';
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
          <Route path="/explore" element={<ProtectedRoute><ExplorePage/></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage/></ProtectedRoute>} />
        </Routes>
    </div>  
  );
}
export default App;
