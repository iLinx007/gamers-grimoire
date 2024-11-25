import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../service/axios.mjs';
import { useSnackbar } from 'notistack';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar(); 
  
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/register', { username, password });
      // console.log(response.data.message);
      // alert('User registered successfully!');
      enqueueSnackbar(response.data.message, { variant: 'success' });
      
      navigate('/login'); // Change this path if your login route is different
    } catch (error) {
      console.error('Error registering user:', error.response?.data?.message || error.message);
      // alert('Error registering user');
      setMessage(error.response?.data?.message || 'An error occurred during registration');
      enqueueSnackbar(error.response?.data?.message || 'An error occurred during registration', { variant: 'error' });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
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
            Register
          </button>
          {/* Login Prompt */}
          <div className="mt-4 text-center">
            <p className="text-gray-700">Have an account?</p>
            <Link
              to="/login"
              className="mt-2 inline-block py-2 px-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
            >
              Login
            </Link>
          </div>
        </form>
        {/* {message && <p className="mt-4 text-red-500 text-center">{message}</p>} */}
      </div>
    </div>
  );
};

export default Register;
