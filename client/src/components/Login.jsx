import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to /api/login
      console.log('Sending login request:', { username, password });
      const response = await axios.post('http://localhost:8080/api/login', { username, password }, { withCredentials: true });

      setMessage(response.data.message); // Success message from the backend
      alert('Login successful!');
      
      // Redirect to "Add Game" page after successful login
      navigate('/addgame'); // Change '/add-game' to the route of your "Add Game" page
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
          >
            Login
          </button>
          {/* Register Prompt */}
          <div className="mt-4 text-center">
            <p className="text-gray-700">Don’t have an account?</p>
            <Link
              to="/register"
              className="mt-2 inline-block py-2 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
            >
              Register
            </Link>
          </div>
        </form>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
