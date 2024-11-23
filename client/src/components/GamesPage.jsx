import React, { useEffect, useState } from 'react';
import GameCard from './GameCard'; // Adjust path as necessary
import api from '../service/axios.mjs'; // Adjust path as necessary

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games'); // Ensure this endpoint is correct
        setGames(response.data); // Assuming response.data contains the array of games
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to fetch games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Game Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game._id} game={game} /> // Ensure you're using a unique key
        ))}
      </div>
    </div>
  );
};

export default GamesPage;