import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const normalizedUserData = {
      ...userData,
      userId: userData.userId || userData.id || userData._id // ✅ consistent key
    };
    
    console.log('Logging in user with normalized data:', normalizedUserData);
    localStorage.setItem('user', JSON.stringify(normalizedUserData));
    setUser(normalizedUserData);
  };
  
  const register = (userData) => {
    const normalizedUserData = {
      ...userData,
      userId: userData.userId || userData.id || userData._id // ✅ consistent key
    };
    localStorage.setItem('user', JSON.stringify(normalizedUserData));
    setUser(normalizedUserData);
  };
  

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}