// AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Set initial state (false until login is confirmed)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Optionally, store user info (like userId) if needed
  const [user, setUser] = useState(null);

  // Call this function after a successful login
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout function resets authentication state
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier context access
export const useAuth = () => useContext(AuthContext);
