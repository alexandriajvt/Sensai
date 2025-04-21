import React from 'react';
//import  useIsAuthenticated  from 'react-auth-kit';
import { Navigate, Outlet } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';


const ProtectedRoute = () => {
  try{

    const isAuthenticated = useIsAuthenticated();

    //console.log('Auth status:', isAuthenticated);//debugging/logging
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace/>;

  }catch(error){
    console.error("an error occurred", error);
    console.log()
  }
};



export default ProtectedRoute;
//next steps: implement a try catch block and then place logs to debug 