import React from 'react';
import  useAuthUser  from 'react-auth-kit';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = useAuthUser();

  return auth() ? children : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;
