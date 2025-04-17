import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";

import ClubDetailsPage from "./pages/ClubDetailsPage";
import LoginPage from "./pages/LoginPage";
// import SUAdminPage from "./pages/SUAdminPage";
// import ClubAdminPage from "./pages/ClubAdminPage";
// import PrivateRoute from "./pages/PrivateRoute"; // optional

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Pages (optional) */}
        {/* <Route path="/admin" element={<SUAdminPage />} /> */}
        {/* <Route path="/clubadmin" element={<ClubAdminPage />} /> */}

        {/* Nested Routes */}
        <Route path="/app" element={<Layout />}>
          <Route path="club" element={<ClubDetailsPage />} />
          {/* <Route path="admin" element={<SUAdminPage />} /> */}
          {/* <Route path="clubadmin" element={<ClubAdminPage />} /> */}


        {/* 404 fallback */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;