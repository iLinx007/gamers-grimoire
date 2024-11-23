import React from 'react';
import grimoireImage from '../assets/grimoire.jpeg';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center px-8">
        <h1 className="text-4xl font-bold mb-4 text-green-400">Welcome to Gamer's Grimoire</h1>
        <img 
          src={grimoireImage} 
          alt="Grimoire" 
          className="mx-auto mb-8 w-64 h-auto rounded-lg shadow-lg" 
        />
        <Link to="/login">
          <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-200">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
