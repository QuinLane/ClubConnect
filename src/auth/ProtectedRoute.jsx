// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ allowedUserType, redirectPath }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Check if user is logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check userType
  const userType = user.userType;
  if (
    (allowedUserType === "Student" && userType !== "Student") ||
    (allowedUserType === "SUAdmin" && userType !== "SUAdmin") ||
    (allowedUserType === "Both" && !["Student", "SUAdmin"].includes(userType))
  ) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
