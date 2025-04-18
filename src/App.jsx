import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequireRole from "./auth/RequireRole";

import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import ClubPage from "./pages/clubPage";
import EventPage from "./pages/eventPage";
import ChatBoardPage from "./pages/chatBoardPage";
import ChatPage from "./pages/chatPage";
import CreateClubForm from "./pages/CreateClubForm";
import DeleteClubForm from "./pages/DeleteClubForm";
import ManageMembersPage from "./pages/manageMembersPage";
import RequestPage from "./pages/requestPage";
import Chat from "./pages/chatPage";
import FundingRequestForm from "./pages/FundingRequestForm";
import Form from "./pages/studentFormPage"
import CompletedForm from "./pages/completedForm";
import ApproveDeny from "./pages/ApproveOrDeny";
import DashboardPage from "./pages/dashboardPage";
import AdminDashboardPage from "./pages/adminDashboardPage";
import ExploreClubsPage from "./pages/ExploreClubs"
import ExploreEventsPage from "./pages/ExploreEvents"
import StudentFormPage from "./pages/studentFormPage"
import { Forbidden } from "./pages/Forbidden";

// 404 Fallback Component
const NotFound = () => {
  return <div>404 - Page Not Found</div>;
};

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<LoginPage />} />

//         {/* Nested Routes under /app with Layout */}
//         <Route path="/app" element={<Layout />}>
//           <Route path="club/:clubID" element={<ClubPage />} />
//           <Route path="event/:eventID" element={<EventPage />} />
//           <Route path="chatboard" element={<ChatBoardPage />} />
//           <Route path="chat/:chatID" element={<ChatPage />} />
//           <Route path="create-club" element={<CreateClubForm />} />
//           <Route path="delete-club/:clubID" element={<DeleteClubForm />} />
//           <Route path="funding-request" element={<FundingRequest />} />
//           <Route
//             path="manage-members/:clubID"
//             element={<ManageMembersPage />}
//           />
//           <Route path="requests" element={<RequestPage />} />
//           <Route path="test" element={<TestPage />} />
//         </Route>

//         {/* 404 Fallback */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Nested Routes under /app with Layout */}
        <Route path="/app" element={<Layout />}>
          <Route path="club" element={<ClubPage />} />
          <Route path="events" element={<EventPage />} />
          <Route path="chatboard" element={<ChatBoardPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="manage-members" element={<ManageMembersPage />} />
          <Route path="requests" element={<RequestPage />} />
          <Route path="chat" element={<Chat />} />
          <Route path="form" element={<Form />} />
          <Route path="completedForm" element={<CompletedForm />} />
          <Route path="ApproveDeny" element={<ApproveDeny />} />
          
          <Route path="funding-request" element={<FundingRequestForm />} />
          <Route path="create-club" element={<CreateClubForm />} />
          <Route path="delete-club" element={<DeleteClubForm />} />

          <Route path="student-forms" element={<StudentFormPage />} />

          <Route path="dashboard" element={<RequireRole allowed={["Student"]}><DashboardPage/></RequireRole>}/>
          <Route path="admin-dashboard" element={<RequireRole allowed={["SUAdmin"]}><AdminDashboardPage /></RequireRole>}/>
          
          <Route path="explore-clubs" element={<ExploreClubsPage />} />
          <Route path="explore-events" element={<ExploreEventsPage />} />
          <Route path="forbidden" element={<Forbidden />} />

        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;