// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">GG</h1>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="hover:text-gray-300">Home</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">About</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">Services</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
