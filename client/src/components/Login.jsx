import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For displaying login status message

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to /api/login
      const response = await axios.post('http://localhost:3000/api/login', { username, password });

      setMessage(response.data.message); // Success message from the backend
      alert('Login successful!');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}  {/* Display the message */}
    </div>
  );
};

export default Login;
