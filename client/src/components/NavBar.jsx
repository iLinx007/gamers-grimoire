import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { AuthContext } from '../context/AuthContext'; // Adjust path as needed

const Navbar = () => {
  const { user, logout, avatarNumber } = useContext(AuthContext);
  const [avatarSrc, setAvatarSrc] = useState(null);
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

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <nav className="p-4 text-white fixed top-0 left-0 w-full h-20 p-5">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/gg-icon.png"
            alt="Gamer's Grimoire Logo"
            className="h-10 w-10"
          />
          <span className="text-xl text-green-600">Gamer's Grimoire</span>
        </Link>

        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search game..."
            className="px-3 bg-gray-200 py-1 rounded-lg text-gray-800 focus:outline-none"
          />
          <button
            className="p-2 bg-gray-200 text-blue-600 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-black" /> {/* Search Icon */}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-4 items-center">
          {user ? (
            <>
              <li className="flex items-center space-x-2">
                <img
                  src={getAvatarSrc(avatarNumber)}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-green-500">{user}</span>
              </li>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            // Show Login and Register links when not logged in
            <>
              <li>
                <Link to="/login" className="hover:underline text-green-500">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline text-green-500">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
