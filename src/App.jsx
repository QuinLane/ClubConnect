import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import LoginPage from "./pages/LoginPage";
import ClubPage from "./pages/clubPage"; // Renamed from ClubDetailsPage for clarity
import EventPage from "./pages/eventPage";
import ChatBoardPage from "./pages/chatBoardPage";
import ChatPage from "./pages/chatPage";
import CreateClubForm from "./pages/CreateClubForm";
import DeleteClubForm from "./pages/DeleteClubForm";
import FundingRequestForm from "./pages/FundingRequestForm";
import ManageMembersPage from "./pages/manageMembersPage";
import RequestPage from "./pages/requestPage";

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

        {/* Nested Routes under /app with Layout */}
        <Route path="/app" element={<Layout />}>
          <Route path="club" element={<ClubPage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="chatboard" element={<ChatBoardPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="create-club" element={<CreateClubForm />} />
          <Route path="delete-club" element={<DeleteClubForm />} />
          <Route path="funding-request" element={<FundingRequestForm />} />
          <Route path="manage-members" element={<ManageMembersPage />} />
          <Route path="requests" element={<RequestPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
