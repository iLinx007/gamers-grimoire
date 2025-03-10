import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      if (result.success) {
        setMessage(result.message);
        enqueueSnackbar(result.message, { variant: 'success' });
        navigate('/games/all')
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      enqueueSnackbar('An error occurred. Please try again.', { variant: 'error' });
      setMessage('An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl transform transition-all duration-500 animate-scale-in">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-400">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your credentials to access your account
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
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
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-green-400 hover:text-green-300 transition-colors duration-300"
                >
                  Sign up now
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

export default Login;
