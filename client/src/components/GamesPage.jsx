import React, { useEffect, useState, useContext } from 'react';
import api from '../service/axios.mjs'; // Adjust path as necessary
import GameCard from './GameCard'; // Import the GameCard component
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';

const Games = () => {
  const [games, setGames] = useState([]);
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
      }
    };

    fetchGames();
  }, []);

  const handleAddToList = async (gameId) => {
    try {
      await api.post(`/games/users/${user.id}/add-game`, { gameId });
      enqueueSnackbar('Game added to list successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error adding game to user list', { variant: 'error' })
      console.error('Error adding game to list:', error);
      setError('Failed to add game to list');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {games.map(game => (
        <GameCard key={game._id} game={game} onAdd={handleAddToList} />
      ))}
    </div>
  );
};

export default Games;