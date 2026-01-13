import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="user-menu-container">
      <button 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
          alt={user.name}
          className="user-avatar"
        />
        <span className="user-name">{user.name}</span>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
              alt={user.name}
              className="user-avatar-large"
            />
            <div className="user-info">
              <h3>{user.name}</h3>
              <Link to="/profile" className="view-profile-link" onClick={() => setIsOpen(false)}>
                View Profile
              </Link>
            </div>
          </div>

          <div className="user-menu-items">
            <Link to="/profile" className="menu-item" onClick={() => setIsOpen(false)}>
              <FaUser />
              Profile
            </Link>
            <Link to="/my-list" className="menu-item" onClick={() => setIsOpen(false)}>
              <FaList />
              My List
            </Link>
            <Link to="/profile?tab=settings" className="menu-item" onClick={() => setIsOpen(false)}>
              <FaCog />
              Settings
            </Link>
            <button className="menu-item logout" onClick={handleLogout}>
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 