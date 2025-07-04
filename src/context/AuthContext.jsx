import React, { useState, createContext, useContext, useEffect } from 'react';
import { MOCK_USERS } from '../Api/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Initialize state from localStorage on first load
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = (role, username, password) => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const expectedUser = MOCK_USERS[role];
      if (username === expectedUser.username && password === expectedUser.password) {
        const userData = { ...expectedUser, role };
        // 2. Save user to state AND localStorage on login
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    // 3. Remove user from state AND localStorage on logout
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = { user, loading, error, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};