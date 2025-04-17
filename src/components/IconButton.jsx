import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IconButton({
  icon: Icon,
  navigateTo,
  activeIcon,
  iconName,
  setActiveIcon,
  size = 20
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    padding: '0.375rem',
    borderRadius: '9999px',
    transition: 'all 0.2s ease',
    backgroundColor: activeIcon === iconName ? 'white' : 'transparent',
    color: activeIcon === iconName ? '#4338ca' : '#3366ff',
    border: isHovered ? '1px solid #3366ff' : '1px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none'
  };

  return (
    <button
      onClick={() => {
        setActiveIcon(iconName);
        navigate(navigateTo);
      }}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={size} color={activeIcon === iconName ? '#4338ca' : '#3366ff'} />
    </button>
  );
}