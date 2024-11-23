import React, { useEffect, useState } from 'react';
import api from '../service/axios.mjs'; // Adjust path as necessary
import GameCard from './GameCard'; // Import the GameCard component

const Games = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games/all'); // Call your API endpoint
        setGames(response.data); // Set the games state with fetched data
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games');
      }
    };

    fetchGames();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {games.map(game => (
        <GameCard key={game._id} game={game} /> // Use GameCard for each game
      ))}
    </div>
  );
};

export default Games;