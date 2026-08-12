// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import EditorPanel from './components/EditorPanel';
import Forbidden from './components/Forbidden';

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
                <Route path="/editor" element={<EditorPanel />} />
              </Route>
              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="*" element={<h2>404 – Not Found</h2>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;