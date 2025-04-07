import React from 'react';
//import  useIsAuthenticated  from 'react-auth-kit';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  //const isAuthenticated = useIsAuthenticated();
  const user = null
  return user ? <Outlet/> : <Navigate to="/login"/>;
};

export default ProtectedRoute;
