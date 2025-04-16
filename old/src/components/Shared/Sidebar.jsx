// import React from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import {
//   LogOut,
//   Home,
//   Users,
//   Search,
//   Layers,
//   ShieldCheck,
// } from "lucide-react";

// const Sidebar = () => {
//   const { logout, currentUser } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error.message);
//     }
//   };

//   return (
//     <aside className="bg-indigo-700 text-white w-full md:w-64 md:h-screen flex flex-col p-4 shadow-lg space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:items-start md:space-y-2">
//         <div className="flex items-center justify-between md:justify-start md:gap-2">
//           <ShieldCheck size={22} />
//           <h1 className="text-base md:text-lg font-bold">Campus Connect</h1>
//         </div>
//         <p className="text-sm text-indigo-100 truncate">
//           Welcome, {currentUser?.email}
//         </p>
//       </div>

//       {/* Navigation - Horizontal on mobile, vertical on desktop */}
//       <nav className="flex flex-row md:flex-col justify-around md:justify-start gap-3 md:gap-4 text-sm font-medium">
//         <button
//           onClick={() => navigate("/app")}
//           className="flex items-center gap-2 hover:text-indigo-200 transition"
//         >
//           <Home size={18} />
//           <span>Home</span>
//         </button>

//         <button
//           onClick={() => navigate("/network")}
//           className="flex items-center gap-2 hover:text-indigo-200 transition"
//         >
//           <Users size={18} />
//           <span>Network</span>
//         </button>

//         <button
//           onClick={() => navigate("/app/explore")}
//           className="flex items-center gap-2 hover:text-indigo-200 transition"
//         >
//           <Search size={18} />
//           <span>Search</span>
//         </button>

//         <button
//           onClick={() => navigate("/groups")}
//           className="flex items-center gap-2 hover:text-indigo-200 transition"
//         >
//           <Layers size={18} />
//           <span>Groups</span>
//         </button>
//       </nav>

//       {/* Logout */}
//       <div className="mt-6 md:mt-auto pt-4 border-t border-indigo-500">
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 text-sm px-3 py-2 bg-red-500 hover:bg-red-600 rounded-md transition"
//         >
//           <LogOut size={16} />
//           Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  Users,
  Search,
  Layers,
  Bell,
  Settings,
  User,
} from "lucide-react";

const Sidebar = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState("home");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const iconStyle = (name) =>
    `relative p-1.5 rounded-full transition ${
      activeIcon === name
        ? "bg-white text-indigo-700"
        : "text-white hover:bg-indigo-600"
    }`;

  const navLinkStyle = (name) =>
    `flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition ${
      activeIcon === name
        ? "bg-white text-indigo-700 font-semibold"
        : "hover:text-indigo-200"
    }`;

  return (
    <aside className="bg-indigo-700 text-white w-full md:w-64 md:h-screen flex flex-col p-4 shadow-lg space-y-6 overflow-y-auto">
      {/* Top Area */}
      <div className="flex flex-col gap-2 md:items-start">
        <div className="flex justify-between items-center md:flex-col md:items-start md:gap-2">
          <h1 className="text-base md:text-lg font-bold">Campus Connect</h1>

          {/* Top Right Icons */}
          <div className="flex space-x-4 md:space-x-2 md:mt-2">
            <button
              onClick={() => {
                setActiveIcon("profile");
                navigate("/app/profile");
              }}
              className={iconStyle("profile")}
            >
              <User size={20} />
            </button>
            <button
              onClick={() => {
                setActiveIcon("settings");
                navigate("/app/settings");
              }}
              className={iconStyle("settings")}
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => {
                setActiveIcon("notifications");
                navigate("/app/notification");
              }}
              className={iconStyle("notifications")}
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1.5 font-bold text-white">
                2
              </span>
            </button>
          </div>
        </div>

        <p className="text-sm text-indigo-100 truncate mt-1 md:mt-0">
          Welcome, {currentUser?.email}
        </p>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-row flex-wrap md:flex-col justify-between md:justify-start gap-2 md:gap-4 mt-2">
        <button
          onClick={() => {
            setActiveIcon("home");
            navigate("/app");
          }}
          className={navLinkStyle("home")}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setActiveIcon("network");
            navigate("/network");
          }}
          className={navLinkStyle("network")}
        >
          <Users size={18} />
          <span>Network</span>
        </button>

        <button
          onClick={() => {
            setActiveIcon("search");
            navigate("/app/explore");
          }}
          className={navLinkStyle("search")}
        >
          <Search size={18} />
          <span>Search</span>
        </button>

        <button
          onClick={() => {
            setActiveIcon("groups");
            navigate("/groups");
          }}
          className={navLinkStyle("groups")}
        >
          <Layers size={18} />
          <span>Groups</span>
        </button>
      </nav>

      {/* Logout */}
      <div className="mt-6 md:mt-auto pt-4 border-t border-indigo-500">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm px-3 py-2 bg-red-500 hover:bg-red-600 rounded-md transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
