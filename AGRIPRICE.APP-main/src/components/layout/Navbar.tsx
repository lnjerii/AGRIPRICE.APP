// src/components/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) => ({
    color: 'white',
    marginRight: '1rem',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: isActive(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    transition: 'background-color 0.2s',
  });

  const buttonStyle = {
    background: 'white',
    color: '#2e7d32',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
  };

  return (
    <nav style={{
      backgroundColor: isDarkMode ? '#01290767' : '#2e7d32',
      padding: '1rem 2rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: `0 2px 4px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          🌾 Agri price
        </Link>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/" style={linkStyle('/')}>
            Home
          </Link>
        </div>
      </div>
      
      {/* Right Side - Auth Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleDarkMode}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
          }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <span style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>
              Welcome, <strong>{user.full_name || user.email}</strong>
            </span>
            <button 
              onClick={signOut}
              style={buttonStyle}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle('/login')}>
              Login
            </Link>
            <Link to="/signup" style={{
              background: 'white',
              color: '#2e7d32',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}