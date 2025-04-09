import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

const Navbar = () => {
  const { user, logout, avatarNumber } = useContext(AuthContext);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    logout();
    navigate('/');
  };

  return (
    <nav className="p-4 text-white fixed top-0 left-0 w-full h-auto md:h-20 bg-gray-900 shadow-lg backdrop-blur-sm bg-opacity-90 z-50">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between md:grid md:grid-cols-3 gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/gg-icon.png"
              alt="Gamer's Grimoire Logo"
              className="h-8 w-8 md:h-10 md:w-10 animate-pulse"
            />
            <span className="text-lg md:text-xl text-green-500 font-semibold transition-colors duration-300 hover:text-green-400">
              Gamer's Grimoire
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Search Bar - Centered */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search game by title or genre..."
                className={`w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none transition-all duration-300 border-2
                  ${isSearchFocused ? 'border-green-500' : 'border-transparent'}
                  placeholder-gray-400`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-green-500 hover:text-green-400 transition-colors"
                onClick={handleSearch}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-end space-x-4">
            {/* User Navigation */}
            {user ? (
              <>
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
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium
                    hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-green-500 transition-all duration-300 hover:text-green-400 hover:underline transform hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-green-500 transition-all duration-300 hover:text-green-400 hover:underline transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col space-y-4 py-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none border-2 border-transparent focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-green-500 hover:text-green-400"
                onClick={handleSearch}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile User Navigation */}
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg"
                >
                  <img
                    src={getAvatarSrc(avatarNumber)}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-green-500">{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  className="w-full bg-gray-800 text-green-500 px-4 py-2 rounded-lg text-center hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="w-full bg-gray-800 text-green-500 px-4 py-2 rounded-lg text-center hover:bg-gray-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
