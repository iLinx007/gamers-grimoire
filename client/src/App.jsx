import { useState } from 'react';
import { SnackbarProvider } from 'notistack';
import './App.css';
import Home from './components/Home';
import Navbar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import GameDetails from './components/GameDetails';
import AddGame from './components/AddGame';
import UserProfile from './components/UserProfile';
import Games from './components/GamesPage';
import SearchResults from './components/SearchResults';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

function App() {
  return (
    <SnackbarProvider maxStack={3}>
    {/* <div className="font-edu text-lg"> */}
      <div className="font-jaro text-lg">
      <Navbar />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/search" element={<SearchResults />} />          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addgame" element={<AddGame />} />
          <Route path="/games/all" element={<Games />} />
          <Route path="/games/:gameId" element={<GameDetails />} />
      </Routes>
      
    </div>
    </SnackbarProvider>
  );
}

export default App;
