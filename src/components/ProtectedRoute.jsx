import React from 'react';
//import  useIsAuthenticated  from 'react-auth-kit';
import { Navigate, Outlet } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';


const ProtectedRoute = () => {

   const isAuthenticated = useIsAuthenticated();

   console.log('Auth status:', isAuthenticated());//debugging/logging

   
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace/>;
};



export default ProtectedRoute;
