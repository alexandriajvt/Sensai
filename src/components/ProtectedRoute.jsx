import React from 'react';
import  useIsAuthenticated  from 'react-auth-kit';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated() ? children : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;
