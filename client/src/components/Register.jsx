import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import api from '../service/axios.mjs';
import { useSnackbar } from 'notistack';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar(); 
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }

    try {
      const response = await api.post('/register', { username, password });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error.response?.data?.message || error.message);
      setMessage(error.response?.data?.message || 'An error occurred during registration');
      enqueueSnackbar(error.response?.data?.message || 'An error occurred during registration', { variant: 'error' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl transform transition-all duration-500 animate-scale-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-400">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join our gaming community today
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="group">
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 group-hover:text-green-400 transition-colors duration-200">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 
                  placeholder-gray-500 text-white rounded-lg bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                  transition-all duration-300"
                placeholder="Choose a username"
              />
            </div>
            
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 group-hover:text-green-400 transition-colors duration-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 
                  placeholder-gray-500 text-white rounded-lg bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                  transition-all duration-300"
                placeholder="Create a password"
              />
            </div>

            <div className="group">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 group-hover:text-green-400 transition-colors duration-200">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-600 
                  placeholder-gray-500 text-white rounded-lg bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                  transition-all duration-300"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white bg-green-500 hover:bg-green-600
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400
                transition-all duration-300 transform hover:scale-105"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors duration-300" 
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" 
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" 
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </span>
              Create Account
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-green-400 hover:text-green-300 transition-colors duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-red-400 animate-fade-in">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
