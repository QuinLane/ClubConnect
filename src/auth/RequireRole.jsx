import { Navigate } from "react-router-dom";

export default function RequireRole({ allowed, children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return allowed.includes(user.userType)
    ? children
    : <Navigate to="../../forbidden" replace />;
}