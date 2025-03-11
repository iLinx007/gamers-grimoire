import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserGameCard from './UserGameCard';
import api from '../service/axios.mjs';
import { enqueueSnackbar } from 'notistack';
import Settings from './Settings';
import { useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon, ClockIcon, FireIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user, avatarNumber } = useContext(AuthContext);
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGames = async () => {
      try {
        const response = await api.get(`/user-games/list/${user.id}`);
        setUserGames(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user games:', error);
        enqueueSnackbar('Failed to load your games', { variant: 'error' });
        setLoading(false);
      }
    };

    if (user) {
      fetchUserGames();
    }
  }, [user]);

  useEffect(() => {
    // Load avatar from localStorage when component mounts
    const storedAvatarSrc = localStorage.getItem('userAvatarSrc');
    if (storedAvatarSrc) {
      setAvatarSrc(storedAvatarSrc);
    }
  }, []);

  useEffect(() => {
    // Update avatarSrc when avatarNumber changes
    if (avatarNumber) {
      const newAvatarSrc = `/avatars/avatar${avatarNumber}.png`;
      setAvatarSrc(newAvatarSrc);
      localStorage.setItem('userAvatarSrc', newAvatarSrc);
    }
  }, [avatarNumber]);

  const handleDeleteGame = async (gameId) => {
    try {
      await api.delete(`/user-games/${user.id}/${gameId}`);
      setUserGames(userGames.filter(game => game.gameId._id !== gameId));
      enqueueSnackbar('Game removed successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting game:', error);
      enqueueSnackbar('Failed to remove game', { variant: 'error' });
    }
  };

  const handleRateGame = (gameId) => {
    // Implement rating functionality
    console.log('Rating game:', gameId);
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      enqueueSnackbar('Failed to log out', { variant: 'error' });
    }
  };

  const handleAddGame = () => {
    navigate('/games/add');
  };

  const filteredGames = () => {
    switch (activeTab) {
      case 'favorites':
        return userGames.filter(game => game.isFavorite);
      case 'recent':
        return [...userGames].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
      case 'top':
        return [...userGames].sort((a, b) => b.averageRating - a.averageRating);
      default:
        return userGames;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={avatarSrc || '/defaultAvatar.png'}
                alt="User Avatar"
                className="w-16 h-16 rounded-full ring-4 ring-green-500/30"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.username}'s Profile
                </h1>
                <p className="text-gray-400">
                  {userGames.length} {userGames.length === 1 ? 'game' : 'games'} in collection
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleAddGame}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Game
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredGames().map(userGame => (
            <UserGameCard
              key={userGame.gameId._id}
              gameId={userGame.gameId._id}
              userId={user.id}
              onDelete={handleDeleteGame}
              onRate={handleRateGame}
            />
          ))}
        </div>

        {userGames.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>You haven't added any games yet.</p>
          </div>
        )}
      </div>

      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default Profile; 