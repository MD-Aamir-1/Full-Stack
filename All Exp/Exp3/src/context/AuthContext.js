// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockLogin, decodeToken } from '../api/mockAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
        });
      } else {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await mockLogin(username, password);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);