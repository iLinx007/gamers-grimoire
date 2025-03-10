import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserGameCard from './UserGameCard';
import api from '../service/axios.mjs';
import { enqueueSnackbar } from 'notistack';
import Settings from './Settings';

const Profile = () => {
  const { user, avatarNumber } = useContext(AuthContext);
  const [userGames, setUserGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);

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
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-green-400 rounded-lg
                hover:bg-gray-600 hover:text-green-300 transition-all duration-300 transform hover:scale-105
                border border-green-500/30 hover:border-green-400/50 shadow-lg hover:shadow-green-500/20"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {userGames.map(userGame => (
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