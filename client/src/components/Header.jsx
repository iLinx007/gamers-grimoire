import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../service/axios.mjs';

const Header = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null); // Clear user state
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      <h1>My App</h1>
      <div>
        {user ? (
          <div>
            <span>Welcome, {user}!</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </header>
  );
};

export default Header;
