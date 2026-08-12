// src/components/Forbidden.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <h1 style={{ fontSize: '4rem', color: 'var(--red-500)' }}>403</h1>
    <h2>Access Denied</h2>
    <p>You do not have permission to view this page.</p>
    <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
  </div>
);

export default Forbidden;