// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white fixed top-0 left-0 w-full h-20 p-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={"/"} className="text-xl font-bold">GG</Link>
        {/* Search Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search game..."
            className="px-3 py-1 rounded-lg text-gray-800 focus:outline-none"
          />
          <button
            className="p-2 bg-gray-200 text-blue-600 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            <MagnifyingGlassIcon className="h-5 w-5 text-black" /> {/* Search Icon */}
          </button>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
          <li>
            <Link to={"/register"}>Register</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
