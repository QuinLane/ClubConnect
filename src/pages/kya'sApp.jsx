import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import ClubDetailsPage from "./pages/ClubDetailsPage";
import EventPage from "./pages/eventPage";
import ClubPage from "./pages/clubPage";
import Chat from "./pages/chatPage";
import MemberManager from "./pages/manageMembersPage"
import Request from "./pages/requestPage"
import ManageMembers from "./pages/manageMembersPage";
import UserDashboard from "./pages/dashboardPage";
import AdminDashboard from "./pages/adminDashboardPage";
import ChatBoard from "./pages/chatBoardPage";
import ExploreEvents from "./pages/eventsExplorePage";
import ExploreClubs from "./pages/exploreClubsPage";
import AdminClubs from "./pages/ClubAdminPage";
import DashboardPage from "./pages/manageMembersPage";
// import SUAdminPage from "./pages/SUAdminPage";
// import ClubAdminPage from "./pages/ClubAdminPage";
// import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Landing page */}
          <Route index element={<AdminClubs />} />

          {/* Nested pages */}
          <Route path="club" element={<ClubDetailsPage />} />
          <Route path="adminDashboard" element={<AdminDashboard />} />
          <Route path="chatBoard" element={<ChatBoard />} />
          <Route path="requests" element={<Request />} />
          <Route path="exploreClubs" element={<ExploreClubs />} />
          <Route path="exploreEvents" element={<ExploreEvents />} />



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
