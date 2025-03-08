import React, { useState, useEffect } from 'react';
import api from '../service/axios.mjs';
import { updateGameStatus } from '../service/userGameService';
import { enqueueSnackbar } from 'notistack';

const UserGameCard = ({ gameId, userId, onDelete, onRate }) => {
  const [game, setGame] = useState(null);
  const [gameStatus, setGameStatus] = useState('not_started');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Get both game data and user game status in parallel
        const [gameResponse, userGameResponse] = await Promise.all([
          api.get(`/games/${gameId}`),
          api.get(`/user-games/list/${userId}`)
        ]);

        setGame(gameResponse.data);
        
        // Find the user's game status
        const userGame = userGameResponse.data.find(ug => 
          // Compare with either _id or the string representation
          ug.gameId._id === gameId || ug.gameId === gameId
        );

        if (userGame) {
          console.log('Found user game status:', userGame.status);
          setGameStatus(userGame.status);
        } else {
          console.log('No user game status found, defaulting to not_started');
          setGameStatus('not_started');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game data:', err);
        setError('Failed to load game data');
        enqueueSnackbar('Failed to load game data', { variant: 'error' });
        setLoading(false);
      }
    };

    if (gameId && userId) {
      fetchGameData();
    }
  }, [gameId, userId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateGameStatus(userId, gameId, newStatus);
      setGameStatus(newStatus);
      setShowStatusDropdown(false);
      enqueueSnackbar('Game status updated successfully', { variant: 'success' });
      // Refresh the page after status update
      window.location.reload();
    } catch (err) {
      console.error('Error updating game status:', err);
      setError('Failed to update game status');
      enqueueSnackbar('Failed to update game status', { variant: 'error' });
    }
  };

  if (loading) return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-48">
      <div className="text-gray-500">Loading game data...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-48">
      <div className="text-red-500">{error}</div>
    </div>
  );
  
  if (!game) return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-48">
      <div className="text-gray-500">No game data available</div>
    </div>
  );

  const imagePath = game.image ? game.image : '/defaultGame.jpg';

  const statusColors = {
    'not_started': 'bg-gray-500 hover:bg-gray-600',
    'ongoing': 'bg-blue-500 hover:bg-blue-600',
    'completed': 'bg-green-500 hover:bg-green-600',
    'aborted': 'bg-red-500 hover:bg-red-600'
  };

  const statusLabels = {
    'not_started': 'Not Started',
    'ongoing': 'Ongoing',
    'completed': 'Completed',
    'aborted': 'Aborted'
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl hover:shadow-[0px_8px_30px_rgba(0,0,0,0.5)] transition-shadow duration-300 ease-in-out overflow-hidden">
      <img
        src={imagePath}
        alt={game.title || 'Game'}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{game.title || 'Untitled Game'}</h3>
        <p className="text-gray-600 mb-2"><strong>Genre:</strong> {Array.isArray(game.genre) ? game.genre.join(', ') : 'N/A'} </p>
        <p className="text-gray-600 mb-2"><strong>Platforms:</strong> {Array.isArray(game.platform) ? game.platform.join(', ') : 'N/A'}</p>
        <p className="text-sm text-gray-500 mb-4">{game.description ? `${game.description.substring(0, 100)}...` : 'No description available'}</p>

        <div className="flex justify-between items-center gap-1">
          <button onClick={() => onRate(game._id)} 
            className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200 min-w-[60px]">
            Rate
          </button>

          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`px-2 py-1 text-xs text-white rounded transition duration-200 min-w-[60px] whitespace-nowrap ${statusColors[gameStatus]}`}
            >
              {statusLabels[gameStatus]}
            </button>
            
            {showStatusDropdown && (
              <div className="absolute bottom-full left-0 mb-1 w-24 bg-white border rounded-md shadow-lg z-10">
                {Object.entries(statusLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => handleStatusChange(value)}
                    className={`w-full text-left px-2 py-1 text-xs hover:bg-gray-100 ${value === gameStatus ? 'bg-gray-50' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => onDelete(game._id)} 
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 min-w-[60px]">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGameCard;
