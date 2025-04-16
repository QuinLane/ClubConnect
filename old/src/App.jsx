import React from 'react'
import { BrowserRouter,  Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StudentDashboard from './pages/StudentDashboard';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import GroupsPage from './pages/GroupsPage';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import EditProfilePage from './pages/EditProfilePage';
import PrivateRoute from './pages/PrivateRoute';
import LandingPage from './pages/LandingPage';
import SettingsPage from './pages/SettingsPage';
import NotificationPage from './pages/NotificationPage';

const App = () => {
  return (

        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="login" element={<Login />} />
          <Route path="signUp" element={<Signup />} />


          <Route
          path="/app"
          element={
            <PrivateRoute>
              <Layout />

            </PrivateRoute>

          }>
            <Route path="editprofile" element={<EditProfilePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notification" element={<NotificationPage />} />




          </Route>

          {/* <Route path="login" element={<Login />} /> */}

          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="student" element={<StudentDashboard />} />

          <Route path="groups" element={<GroupsPage />} />
          {/* <Route path="profile" element={<ProfilePage />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}


      </Routes>



  )
}

export default App