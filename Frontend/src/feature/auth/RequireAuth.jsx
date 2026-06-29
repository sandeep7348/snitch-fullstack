import React from "react";
import { useAuth } from "./hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
