import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
// import ClubAdminPage from "./pages/ClubAdminPage";
import ClubDetailsPage from "./pages/ClubDetailsPage";
// import SUAdminPage from "./pages/SUAdminPage";
// import PrivateRoute from "./pages/PrivateRoute"; // optional for later
// import other pages if needed...

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Root route (optional) */}
        {/* <Route path="/" element={<LandingPage />} /> */}

        {/* Public routes */}
        {/* <Route path="admin" element={<SUAdminPage />} /> */}
        {/* <Route path="clubadmin" element={<ClubAdminPage />} /> */}

        {/* Nested routes under /app */}
        <Route path="/app" element={<Layout />}>
          <Route path="club" element={<ClubDetailsPage />} />
          {/* Add more nested routes here */}
        </Route>

        {/* Optional 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
