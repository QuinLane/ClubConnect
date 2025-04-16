// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isAuthenticated,loading } = useAuth();

  console.log("PrivateRoute:", { isAuthenticated, loading });

  // If not authenticated, navigate to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }


  // Otherwise, render the requested page
  return children;
}
