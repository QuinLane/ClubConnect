import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="layout">
      <h2>This is the layout wrapper</h2>
      <Outlet /> {/* This is where nested routes render */}
    </div>
  );
};

export default Layout;
