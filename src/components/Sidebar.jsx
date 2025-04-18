import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import SidebarButton from './SideButton';
import IconButton from './IconButton';
import { 
  LogOut, 
  Home, 
  Users, 
  Calendar, 
  ShieldHalf, 
  Bell, 
  StickyNote, 
  User,
  MessageSquareText // 👈 Importing a suitable message icon from Lucide
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState('home');

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  const iconStyle = (name) => 
    `p-1.5 rounded-full transition ${
      activeIcon === name
        ? 'bg-white text-indigo-700'
        : 'text-white hover:bg-indigo-600'
    }`;

  return (
    <div className="text-white w-64 h-full flex flex-col p-4 shadow-lg"
    style={{
      width: "13%",
      backgroundColor: "white",
    }}>
      <img 
        src={logo} 
        alt="ClubConnect Logo" 
        style={{
          height: "9%",
          width: "90%",
        }}
      />

      <div style={{
        marginBottom: "10%",
        display: "flex",
        justifyContent: "space-evenly"
      }}>
        <IconButton
          icon={User}
          navigateTo="/app/profile"
          activeIcon={activeIcon}
          iconName="profile"
          setActiveIcon={setActiveIcon}
        />
        <IconButton
          icon={Bell}
          navigateTo="/app/notifications"
          activeIcon={activeIcon}
          iconName="notifications"
          setActiveIcon={setActiveIcon}
        />
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarButton
          icon={Home}
          label="Home"
          navigateTo="/app/dashboard"
          activeIcon={activeIcon}
          iconName="home"
          setActiveIcon={setActiveIcon}
        />
        <SidebarButton
          icon={ShieldHalf}
          label="Explore Clubs"
          navigateTo="/app/explore-clubs"
          activeIcon={activeIcon}
          iconName="clubs"
          setActiveIcon={setActiveIcon}
        />
        <SidebarButton
          icon={Calendar}
          label="Explore Events"
          navigateTo="/app/explore-events"
          activeIcon={activeIcon}
          iconName="explore"
          setActiveIcon={setActiveIcon}
        />
        <SidebarButton
          icon={StickyNote}
          label="Forms"
          navigateTo="/app/Forms"
          activeIcon={activeIcon}
          iconName="StickyNote"
          setActiveIcon={setActiveIcon}
        />

        {/* 👉 Messages button added here */}
        <SidebarButton
          icon={MessageSquareText}
          label="Messages"
          navigateTo="/app/chat"
          activeIcon={activeIcon}
          iconName="messages"
          setActiveIcon={setActiveIcon}
        />
      </nav>

      <div className="mt-auto space-y-4 pt-4 border-t border-indigo-600">
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '10px',
            marginBottom: '5px',
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            borderRadius: '0.375rem',
            color: 'white',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
