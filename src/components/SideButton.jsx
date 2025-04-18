import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SidebarButton({
  icon: Icon,
  label,
  navigateTo,
  activeIcon,
  iconName,
  setActiveIcon
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getButtonStyle = () => {
    const isActive = activeIcon === iconName;
    return {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      transition: 'all 0.2s ease',
      backgroundColor: isActive ? 'white' : 'transparent',
      color: '#3366ff',
      fontWeight: isActive ? '500' : 'normal',
      border: isHovered ? '1px solid #3366ff' : '1px solid transparent',
      cursor: 'pointer',
      outline: 'none'
    };
  };

  return (
    <button
      onClick={() => {
        setActiveIcon(iconName);
        navigate(navigateTo);
      }}
      style={getButtonStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={20} color="#3366ff" />
      <span>{label}</span>
    </button>
  );
}