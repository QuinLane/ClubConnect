// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute"; // Import ProtectedRoute

import Layout from "./pages/Layout";
import SuLayout from "./pages/SuLayout";
import LoginPage from "./pages/LoginRegister/LoginPage";
import RegisterPage from "./pages/LoginRegister/Register";
import ClubPage from "./pages/ClubPage";
import EventPage from "./pages/EventPage";
import ChatStudent from "./pages/ChatStudent";
import ChatSU from "./pages/ChatSU";
import ManageMembersPage from "./pages/manageMembersPage";
import RequestPage from "./pages/FormsSU";
import DashboardPage from "./pages/Dashboards/dashboardPage";
import AdminDashboardPage from "./pages/Dashboards/adminDashboardPage";
import ExploreClubsPage from "./pages/ExploreClubs";
import ExploreEventsPage from "./pages/ExploreEvents";
import StudentFormPage from "./pages/FormsStudent";
import { Forbidden } from "./pages/errors/Forbidden";

// 404 Fallback Component
const NotFound = () => {
  return <div>404 - Page Not Found</div>;
};

// Root Redirect Component
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // If not logged in, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user type
  if (user.userType === "SUAdmin") {
    return <Navigate to="/app/admin-dashboard" replace />;
  } else {
    return <Navigate to="/app/dashboard" replace />;
  }
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Root Route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Nested Routes under /app */}
        <Route path="/app">
          {/* SUAdmin-only routes with suLayout */}
          <Route element={<SuLayout />}>
            <Route
              element={
                <ProtectedRoute
                  allowedUserType="SUAdmin"
                  redirectPath="/forbidden"
                />
              }
            >
              <Route path="admin-dashboard" element={<AdminDashboardPage />} />
            </Route>
          </Route>

          {/* Student-only routes */}
          <Route
            element={
              <ProtectedRoute
                allowedUserType="Student"
                redirectPath="/forbidden"
              />
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="club/:clubID" element={<ClubPage />} />
            <Route path="events/:eventID" element={<EventPage />} />
            <Route path="chat" element={<ChatStudent />} />
            <Route path="chatSU" element={<ChatSU />} />
            <Route
              path="manage-members/:clubID"
              element={<ManageMembersPage />}
            />
            <Route path="requests" element={<RequestPage />} />
            <Route path="student-forms" element={<StudentFormPage />} />
            <Route path="explore-clubs" element={<ExploreClubsPage />} />
            <Route path="explore-events" element={<ExploreEventsPage />} />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
