import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const location = useLocation();
  const showSidebar = !location.pathname.includes('/login');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${showSidebar ? 'ml-[20px]' : ''} p-4`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
