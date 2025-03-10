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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [gameResponse, userGameResponse] = await Promise.all([
          api.get(`/games/${gameId}`),
          api.get(`/user-games/list/${userId}`)
        ]);

        setGame(gameResponse.data);
        
        const userGame = userGameResponse.data.find(ug => 
          ug.gameId._id === gameId || ug.gameId === gameId
        );

        if (userGame) {
          setGameStatus(userGame.status);
        } else {
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
      window.location.reload();
    } catch (err) {
      console.error('Error updating game status:', err);
      setError('Failed to update game status');
      enqueueSnackbar('Failed to update game status', { variant: 'error' });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              rating >= star ? 'text-yellow-400' : 'text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-center h-32">
      <div className="text-gray-400 animate-pulse">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-center h-32">
      <div className="text-red-500">{error}</div>
    </div>
  );
  
  if (!game) return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-center h-32">
      <div className="text-gray-400">No game data available</div>
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
    <div className="relative group">
      <div 
        className={`fixed inset-0 bg-black transition-all duration-500 ${
          isExpanded ? 'bg-opacity-50 backdrop-blur-sm z-20' : 'bg-opacity-0 backdrop-blur-none -z-10'
        }`}
        onClick={() => setIsExpanded(false)}
      />

      <div
        className={`
          relative bg-gray-800 rounded-lg shadow-lg
          transition-all duration-500 ease-out
          ${isExpanded ? 
            'transform scale-110 rotate-0 translate-y-0 z-30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 
            'transform scale-100 rotate-0 translate-y-0 hover:scale-105'
          }
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative overflow-hidden rounded-t-lg h-32">
          <img
            src={imagePath}
            alt={game.title}
            className={`
              w-full h-full object-cover 
              transition-all duration-500
              ${isExpanded ? 'transform scale-110' : 'transform scale-100 hover:scale-110'}
            `}
          />
          <div 
            className={`
              absolute inset-0 bg-black
              transition-all duration-500 ease-in-out flex items-center justify-center gap-2
              ${isExpanded ? 'bg-opacity-60' : 'bg-opacity-0'}
            `}
          >
            {isExpanded && (
              <>
                <button 
                  onClick={() => onRate(game._id)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg
                    transition-all duration-500 transform
                    hover:bg-yellow-600 hover:scale-105 hover:shadow-lg
                    flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Rate
                </button>
                <button 
                  onClick={() => onDelete(game._id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg
                    transition-all duration-500 transform
                    hover:bg-red-600 hover:scale-105 hover:shadow-lg"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-3 space-y-1">
          <h3 className="text-base font-semibold text-white line-clamp-1">{game.title}</h3>
          
          <div className="space-y-1 text-sm">
            <p className="text-gray-300 line-clamp-1">
              <span className="text-gray-400">Genre:</span> {game.genre.join(', ')}
            </p>
            <p className="text-gray-300 line-clamp-1">
              <span className="text-gray-400">Platforms:</span> {game.platform.join(', ')}
            </p>
            
            {game.rating > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Rating:</span>
                {renderStars(game.rating)}
              </div>
            )}
            
            <div className={`
              overflow-hidden transition-all duration-500
              ${isExpanded ? 'max-h-24' : 'max-h-0'}
            `}>
              <p className="text-gray-400 text-sm line-clamp-3">
                {game.description}
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`w-full px-3 py-1 text-xs text-white rounded-lg transition-all duration-300
                  ${statusColors[gameStatus]} whitespace-nowrap text-center`}
              >
                {statusLabels[gameStatus]}
              </button>
              
              {showStatusDropdown && (
                <div className="absolute bottom-full left-0 mb-1 w-24 bg-gray-700 border border-gray-600 
                  rounded-md shadow-lg z-40 animate-fade-in">
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => handleStatusChange(value)}
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-600 text-white
                        ${value === gameStatus ? 'bg-gray-600' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGameCard;
