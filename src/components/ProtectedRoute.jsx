import React from "react";
import { useAuthUser } from "react-auth-kit";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const auth = useAuthUser();

  return auth() ? children : <Navigate to="/signin" />;
}

export default ProtectedRoute;