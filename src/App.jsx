import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Template from "./pages/Template"; // LandingPage
import ClubDetailsPage from "./pages/ClubDetailsPage";
import EventPage from "./pages/eventPage";
import ClubPage from "./pages/clubPage";

// import SUAdminPage from "./pages/SUAdminPage";
// import ClubAdminPage from "./pages/ClubAdminPage";
// import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Landing page */}
          <Route index element={<ClubPage />} />

          {/* Nested pages */}
          <Route path="club" element={<ClubDetailsPage />} />
          {/* <Route path="admin" element={<SUAdminPage />} /> */}
          {/* <Route path="clubadmin" element={<ClubAdminPage />} /> */}

          {/* Catch-all (404) */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
