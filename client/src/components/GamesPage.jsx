import React, { useEffect, useState, useContext } from 'react';
import api from '../service/axios.mjs'; // Adjust path as necessary
import GameCard from './GameCard'; // Import the GameCard component
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';
import { addGameToList } from '../service/userGameService';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games/all');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games');
        enqueueSnackbar('Failed to load games', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleAddToList = async (gameId) => {
    if (!user || !user.id) {
      enqueueSnackbar('Please log in to add games to your list', { variant: 'warning' });
      return;
    }

    try {
      await addGameToList(user.id, gameId);
      enqueueSnackbar('Game added to your list successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error adding game to list:', error);
      if (error.response?.status === 400 && error.response?.data?.message === 'Game already in user\'s list') {
        enqueueSnackbar('This game is already in your list', { variant: 'info' });
      } else {
        enqueueSnackbar('Failed to add game to your list', { variant: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!games.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">No games available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Games Library</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map(game => (
          <GameCard key={game._id} game={game} onAdd={handleAddToList} />
        ))}
      </div>
    </div>
  );
};

export default Games;