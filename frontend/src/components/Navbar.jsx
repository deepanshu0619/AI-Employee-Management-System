import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container flex justify-between items-center" style={{ padding: '1rem 2rem' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EmpManage AI
          </h2>
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/" className="btn btn-secondary btn-sm" style={{ border: 'none' }}>Dashboard</Link>
              <Link to="/add" className="btn btn-secondary btn-sm" style={{ border: 'none' }}>Add Employee</Link>
              <Link to="/ai" className="btn btn-secondary btn-sm" style={{ border: 'none' }}>AI Insights</Link>
              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)', margin: '0 8px' }}></div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-secondary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
