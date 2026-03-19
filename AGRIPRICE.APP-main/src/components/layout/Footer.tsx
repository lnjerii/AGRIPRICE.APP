import { Link } from 'react-router-dom';
import './../Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <i className="fas fa-tractor"></i>
            <span>Agri Price</span>
          </div>
          <p className="footer-description">
            Connecting farmers, dealers, and market officers for transparent agricultural trading.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/market-prices">Market Prices</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Account</h3>
          <ul className="footer-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Roles</h3>
          <ul className="footer-links">
            <li><Link to="/signup?type=farmer">For Farmers</Link></li>
            <li><Link to="/signup?type=dealer">For Dealers</Link></li>
            <li><Link to="/signup?type=officer">For Officers</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Agri Price. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 