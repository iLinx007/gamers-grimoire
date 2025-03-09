import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

const Navbar = () => {
  const { user, logout, avatarNumber } = useContext(AuthContext);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load avatar from localStorage when component mounts
    const storedAvatarSrc = localStorage.getItem('userAvatarSrc');
    if (storedAvatarSrc) {
      setAvatarSrc(storedAvatarSrc);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Update avatarSrc when avatarNumber changes
    if (avatarNumber) {
      const newAvatarSrc = `/avatars/avatar${avatarNumber}.png`;
      setAvatarSrc(newAvatarSrc);
      localStorage.setItem('userAvatarSrc', newAvatarSrc);
    }
  }, [avatarNumber]);

  const getAvatarSrc = () => {
    return avatarSrc; // Fallback to default if no avatar
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <nav className="p-4 text-white fixed top-0 left-0 w-full h-20 bg-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with animation */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/gg-icon.png"
            alt="Gamer's Grimoire Logo"
            className="h-10 w-10 animate-pulse"
          />
          <span className="text-xl text-green-500 font-semibold transition-colors duration-300 hover:text-green-400">
            Gamer's Grimoire
          </span>
        </Link>

        {/* Animated Search Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search game by title or genre..."
              className={`px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none transition-all duration-300 border-2
                ${isSearchFocused ? 'w-64 border-green-500' : 'w-48 border-transparent'}
                placeholder-gray-400`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
          <button
            className="p-2 bg-gray-800 text-green-500 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:text-green-400 transform hover:scale-105"
            onClick={handleSearch}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links with hover effects */}
        <ul className="flex space-x-4 items-center">
          {user ? (
            <>
              <li className="flex items-center space-x-2">
                <Link 
                  to="/profile" 
                  className="flex items-center group transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={getAvatarSrc(avatarNumber)}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:ring-green-500"
                  />
                  <span className="text-green-500 ml-2 transition-colors duration-300 group-hover:text-green-400">
                    {user.username}
                  </span>
                </Link>
              </li>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-red-600 transform hover:scale-105 hover:shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            // Show Login and Register links when not logged in
            <>
              <li>
                <Link 
                  to="/login" 
                  className="text-green-500 transition-all duration-300 hover:text-green-400 hover:underline transform hover:scale-105 inline-block"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-green-500 transition-all duration-300 hover:text-green-400 hover:underline transform hover:scale-105 inline-block"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
