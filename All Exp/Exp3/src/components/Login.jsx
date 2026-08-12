// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast, ToastContainer } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const roles = [
    { 
      id: 'admin', 
      label: 'Admin Login', 
      icon: '🔑', 
      color: '#4f46e5',
      description: 'Full control – manage users, posts, settings' 
    },
    { 
      id: 'editor', 
      label: 'Editor Login', 
      icon: '✏️', 
      color: '#22c55e',
      description: 'Create, edit & publish posts' 
    },
    { 
      id: 'viewer', 
      label: 'User Login', 
      icon: '👀', 
      color: '#64748b',
      description: 'Read-only access' 
    },
  ];

  const handleCardClick = (roleId) => {
    setSelectedRole(roleId);
    setShowModal(true);
    setPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      addToast('Please select a role first', 'error');
      return;
    }
    if (!password.trim()) {
      addToast('Please enter your password', 'error');
      return;
    }
    setLoading(true);
    const result = await login(selectedRole, password);
    setLoading(false);
    if (result.success) {
      addToast(`Logged in as ${selectedRole}`, 'success');
      setShowModal(false);
      navigate('/dashboard');
    } else {
      addToast(result.error, 'error');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setPassword('');
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="login-page">
      <ToastContainer />
      
      <div className="login-container">
        <div className="login-header">
          {/* Removed the brand line: <h1 className="login-brand">📘 MyApp</h1> */}
          <h2 className="login-title">Welcome</h2>
          <p className="login-subtitle">Choose your role to continue</p>
        </div>

        <div className="role-grid-cuims">
          {roles.map((role) => (
            <div 
              key={role.id} 
              className="role-card-cuims"
              style={{ '--role-color': role.color }}
            >
              <div className="role-icon-cuims">{role.icon}</div>
              <h3 className="role-name-cuims">{role.label}</h3>
              <p className="role-desc-cuims">{role.description}</p>
              <button 
                className="role-login-btn"
                onClick={() => handleCardClick(role.id)}
                style={{ backgroundColor: role.color }}
              >
                Login Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              <span className="modal-icon">{selectedRoleData?.icon}</span>
              <h3>{selectedRoleData?.label}</h3>
              <p className="modal-desc">{selectedRoleData?.description}</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (pass)"
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            <p className="modal-hint">Use password: <strong>pass</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;