import React, { createContext, useState, useEffect } from 'react';
import api from '../service/axios.mjs'; // Adjust path if necessary

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [avatarNumber, setAvatarNumber] = useState(null);

  // Check session on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get('/session');
        if (data.loggedIn) {
          setUser(data.username);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null); // Ensure user is set to null on error
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);


  const generateAvatarNumber = () => {
    return Math.floor(Math.random() * 20) + 1;
  };

  // Login function
  const login = async (username, password) => {
    try {
      const { data } = await api.post('/login', { username, password });
      const avatarNumber = generateAvatarNumber();
      setAvatarNumber(avatarNumber);
      setUser(username);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

 
  const logout = async (navigate) => {
    try {
      await api.post('/logout');
      setUser(null);
      setAvatarNumber(null);
      localStorage.removeItem('userAvatarSrc');
      if (typeof navigate === 'function') {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // AuthContext values
  const value = {
    user,
    login,
    logout,
    setUser, // Optional: Keep for flexibility
    loading,
    avatarNumber, // Useful for showing a loading spinner
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after session check */}
    </AuthContext.Provider>
  );
};
