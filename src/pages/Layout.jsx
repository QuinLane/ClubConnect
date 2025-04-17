import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const location = useLocation();
  const showSidebar = !location.pathname.includes('/login');

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      <div className={`${showSidebar ? 'flex-1' : 'w-full'} overflow-auto bg-gray-50`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;