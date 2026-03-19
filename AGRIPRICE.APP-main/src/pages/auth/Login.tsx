import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './../pages.css';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Watch for user changes after successful login
  useEffect(() => {
    if (shouldRedirect && user) {
      const getRoleBasedPath = (role?: string) => {
        switch (role) {
          case 'farmer':
            return '/farmer/dashboard';
          case 'agrodealer':
            return '/agrodealer/dashboard';
          case 'market_officer':
            return '/officer/dashboard';
          case 'admin':
            return '/admin/dashboard';
          default:
            return '/';
        }
      };

      const redirectPath = getRoleBasedPath(user.role);
      navigate(redirectPath);
      setShouldRedirect(false);
    }
  }, [user, shouldRedirect, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(formData.email, formData.password);
      setShouldRedirect(true);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-home">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
          <div className="logo">
            <i className="fas fa-tractor"></i>
            <span>Agri price</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-content">
            <div className="auth-card-header">
              <h1>Welcome back</h1>
              <p className="auth-subtitle">
                Log in to your Agri price account to access your dashboard
              </p>
            </div>

            {error && <div style={{ padding: 12, background: '#eaf7ee', color: '#1f4d2d', borderRadius: 6, marginBottom: 12 }}>{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="your@email.com"
                    required
                  />
                  <i className="fas fa-envelope"></i>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="••••••••"
                    required
                  />
                  <i className="fas fa-lock"></i>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-auth"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>

              <div className="auth-divider">
                <span>New to Agri price?</span>
              </div>

              <Link
                to="/signup"
                className="btn btn-outline btn-auth"
              >
                <i className="fas fa-user-plus"></i> Create Account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

