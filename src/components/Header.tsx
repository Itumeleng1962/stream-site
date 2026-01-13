import { Link, useLocation } from 'react-router-dom'
import { FaBell, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import UserMenu from './UserMenu'
import { useState, useEffect, useRef } from 'react'

export default function Header() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (dropdownOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [dropdownOpen])

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', padding: '0.25rem 0.75rem', textDecoration: 'none' }}>
            <span style={{
              display: 'flex',
              gap: '0.5rem',
              fontWeight: 900,
              fontSize: '1.35rem',
              letterSpacing: '2px',
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              borderRadius: '8px',
              padding: '0.15rem 0.7rem',
              alignItems: 'center',
            }}>
              <span className="prince-fani-logo-red">Prince</span>
              <span className="prince-fani-logo-silver">Fani</span>
              <span className="prince-fani-logo-gold">Production</span>
            </span>
          </Link>
          <nav className="nav-menu desktop-nav">
            {user && (
              <>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                <Link to="/movies" className={`nav-link ${location.pathname === '/movies' ? 'active' : ''}`}>Movies</Link>
                <Link to="/tv-shows" className={`nav-link ${location.pathname === '/tv-shows' ? 'active' : ''}`}>TV Shows</Link>
                <Link to="/my-list" className={`nav-link ${location.pathname === '/my-list' ? 'active' : ''}`}>My List</Link>
                <Link to="/browse-languages" className={`nav-link ${location.pathname === '/browse-languages' ? 'active' : ''}`}>Languages</Link>
                <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`}>News</Link>
              </>
            )}
          </nav>
        </div>
        <div className="header-right desktop-nav">
          {user && (
            <div className="notifications" ref={notifRef}>
              <button
                className="notif-bell-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Show notifications"
              >
                <FaBell className="notification-icon" />
                <span className="notification-badge">3</span>
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">Notifications</div>
                  <ul className="notif-list">
                    <li className="notif-item"><b>New episode</b> of <i>Better Call Saul</i> is now available!</li>
                    <li className="notif-item">Your subscription will renew in 3 days.</li>
                    <li className="notif-item">Welcome to the platform! Enjoy streaming.</li>
                  </ul>
                  <div className="notif-dropdown-footer">
                    <button className="notif-view-all-btn">View All</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn login">Login</Link>
              <Link to="/signup" className="auth-btn signup">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
      
      <button 
        className="hamburger-menu" 
        onClick={() => setDropdownOpen(!dropdownOpen)} 
        aria-label={dropdownOpen ? "Close menu" : "Open menu"}
        style={{ display: 'block' }}
      >
        {dropdownOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div className={`mobile-dropdown-overlay ${dropdownOpen ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
        <nav className={`mobile-dropdown ${dropdownOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="dropdown-links">
            {user && (
              <>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                  Home
                </Link>
                <Link to="/movies" className={`nav-link ${location.pathname === '/movies' ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                  Movies
                </Link>
                <Link to="/tv-shows" className={`nav-link ${location.pathname === '/tv-shows' ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                  TV Shows
                </Link>
                <Link to="/my-list" className={`nav-link ${location.pathname === '/my-list' ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                  My List
                </Link>
                <Link to="/browse-languages" className={`nav-link ${location.pathname === '/browse-languages' ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                  Languages
                </Link>
                <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`} onClick={() => setDropdownOpen(false)}>
                  News
                </Link>
              </>
            )}
          </div>
          {user && (
            <>
              <div className="dropdown-divider" />
              <div className="dropdown-user-info">
                <div className="dropdown-user-avatar">
                  <img src={user.avatar || '/placeholder-user.jpg'} alt={user.name} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                </div>
                <div className="dropdown-user-name">{user.name}</div>
                <div className="dropdown-user-email">{user.email}</div>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-notifications">
                <FaBell size={20} />
                <span>Notifications</span>
                <span className="notification-badge">3</span>
              </div>
              <Link to="/profile" className="nav-link" onClick={() => setDropdownOpen(false)}>Profile</Link>
              <button className="danger-btn" style={{marginTop: 16, width: '100%'}} onClick={() => { setDropdownOpen(false); logout(); }}>
                <FaSignOutAlt style={{marginRight: 8}} /> Sign Out
              </button>
            </>
          )}
          {!user && (
            <div className="dropdown-auth-buttons">
              <Link to="/login" className="auth-btn login" onClick={() => setDropdownOpen(false)}>Login</Link>
              <Link to="/signup" className="auth-btn signup" onClick={() => setDropdownOpen(false)}>Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
} 