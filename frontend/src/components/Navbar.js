import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Lost & Found
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/search" className="navbar-link">Search</Link>
          
          {user ? (
            <>
              <Link to="/post-item" className="navbar-link">Post Item</Link>
              <Link to="/dashboard" className="navbar-link">Dashboard</Link>
              {(user.role === 'admin' || user.is_superuser) && (
                <Link to="/dashboard?admin=true" className="navbar-link admin-link">
                  Admin Panel
                </Link>
              )}
              <span className="navbar-user">{user.email}</span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-button">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

