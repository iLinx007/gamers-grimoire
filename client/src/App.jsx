import { useState } from 'react';
import './App.css';
import Home from './components/Home';
import Navbar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

function App() {
  return (
    // <div className="font-jaro text-lg"></div>
    <div className="font-edu text-lg">
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
      </Routes>
      
    </div>
  );
}

export default App;
