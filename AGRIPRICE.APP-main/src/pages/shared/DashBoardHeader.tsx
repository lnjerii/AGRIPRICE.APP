import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'
//import './DashboardHeader.css';

export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const roleLabel = () => {
    switch (user?.role) {
      case 'farmer':
        return 'Farmer';
      case 'agrodealer':
        return 'Agro-Dealer';
      case 'market_officer':
        return 'Market Officer';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1>AgriPrice Hub</h1>
        <span className={`role-badge role-${user?.role}`}>
          {roleLabel()}
        </span>
      </div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-name">
            {user?.full_name || user?.email}
          </span>
          {user?.market && (
            <span className="user-market">{user.market}</span>
          )}
        </div>

        <button
          className="header-btn"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>

        <button
          className="header-btn logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
