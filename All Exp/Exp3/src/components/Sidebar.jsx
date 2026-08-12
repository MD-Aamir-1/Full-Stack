// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">📘 MyApp</div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end>Dashboard</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin">Admin Panel</NavLink>}
        {(user?.role === 'admin' || user?.role === 'editor') && (
          <NavLink to="/editor">Editor Panel</NavLink>
        )}
      </nav>
      <div className="sidebar-user">
        <div className="avatar">{initial}</div>
        <div className="user-info">
          <div className="name">{user?.username}</div>
          <div className="role">{user?.role}</div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;