import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../service/axios.mjs';
import { useSnackbar } from 'notistack';
import GameCard from './GameCard';

function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const searchTerm = new URLSearchParams(location.search).get('term');
    
    if (searchTerm) {
      
      api.get(`/games/search?term=${searchTerm}`)
        .then(response => {
          setResults(response.data);
          enqueueSnackbar(`Found ${response.data.length} results for "${searchTerm}"`, { variant: 'success' });
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          enqueueSnackbar('Error fetching search results', { variant: 'error' });
        });
    }
  }, [location.search, enqueueSnackbar]);


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

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <h2 className="text-2xl font-bold mb-6">Search Results</h2>
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {/* {results.map(game => (
  //         <GameCard key={game._id} game={game} />
  //       ))} */}
  //       {results.map(game => (
  //       <GameCard key={game._id} game={game} onAdd={handleAddToList} />
  //     ))}
  //     </div>
  //   </div>
  // );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map(game => (
        <GameCard key={game._id} game={game} onAdd={handleAddToList} />
      ))}
    </div>
  );
}

export default SearchResults;