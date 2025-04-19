// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute"; // Import ProtectedRoute

import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginRegister/LoginPage";
import RegisterPage from "./pages/LoginRegister/Register";
import ClubPage from "./pages/clubPage";
import EventPage from "./pages/EventPage";
import ChatBoardPage from "./pages/chatBoardPage";
import ChatPage from "./pages/chatPage";
import ManageMembersPage from "./pages/manageMembersPage";
import RequestPage from "./pages/requestPage";
import Chat from "./pages/chatPage";
import CompletedForm from "./pages/completedForm";
import DashboardPage from "./pages/Dashboards/dashboardPage";
import AdminDashboardPage from "./pages/Dashboards/adminDashboardPage";
import ExploreClubsPage from "./pages/ExploreClubs";
import ExploreEventsPage from "./pages/ExploreEvents";
import StudentFormPage from "./pages/StudentFormPage";
import { Forbidden } from "./pages/errors/Forbidden";

// 404 Fallback Component
const NotFound = () => {
  return <div>404 - Page Not Found</div>;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Nested Routes under /app with Layout */}
        <Route path="/app" element={<Layout />}>
          {/* SUAdmin-only route */}
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
            <Route path="chatboard" element={<ChatBoardPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route
              path="manage-members/:clubID"
              element={<ManageMembersPage />}
            />
            <Route path="requests" element={<RequestPage />} />
            <Route path="chat" element={<Chat />} />
            <Route path="completedForm" element={<CompletedForm />} />
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
