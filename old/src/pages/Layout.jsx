import { Outlet } from "react-router-dom";

import Navbar from "../components/NavBar/NavBar";
import Sidebar from "../components/Shared/Sidebar";

export default function Layout() {
  return (
      <div className="md:flex min-h-sceen">
        <Sidebar />
        <main className="flex-1 bg-gray-100 p-4">
          <Outlet /> {/* This is where the child route renders */}
        </main>
      </div>
  );
}
