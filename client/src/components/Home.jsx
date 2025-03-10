import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import grimoireImage from '../assets/grimoire.jpeg';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // If user is logged in, redirect to games page
    if (user) {
      navigate('/games/all');
    }
  }, [user, navigate]);

  // If user is not logged in, show landing page
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white animate-fade-in">
        <div className="text-center px-8 space-y-6">
          <h1 className="text-4xl font-bold mb-4 text-green-400 animate-slide-in">
            Welcome to Gamer's Grimoire
          </h1>
          <div className="relative animate-scale-in">
            <img 
              src={grimoireImage} 
              alt="Grimoire" 
              className="mx-auto w-64 h-auto rounded-lg shadow-lg hover:shadow-green-500/50 transition-shadow duration-300" 
            />
            <div className="absolute inset-0 bg-green-500/10 rounded-lg"></div>
          </div>
          <p className="text-gray-300 max-w-md mx-auto animate-fade-in">
            Your personal gaming journal where you can track, rate, and manage your gaming adventures.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg 
              transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Return null while redirecting
  return null;
};

export default Home;