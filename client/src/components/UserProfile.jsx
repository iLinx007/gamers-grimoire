import React, { useEffect, useState, useContext } from 'react';
import api from '../service/axios.mjs';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserGameCard from './UserGameCard';
import { enqueueSnackbar } from 'notistack';
import { getUserGameList } from '../service/userGameService';
import Settings from './Settings';
import RatingModal from './RatingModal';
import ConfirmationModal from './ConfirmationModal';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [userGames, setUserGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatarSrc, setAvatarSrc] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [selectedGameToDelete, setSelectedGameToDelete] = useState(null);
    const [currentGameRating, setCurrentGameRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user || !user.id) {
                setError('User not logged in or invalid user ID');
                setLoading(false);
                return;
            }

            try {
                const [profileResponse, userGamesResponse] = await Promise.all([
                    api.get(`games/user/${user.id}`, { withCredentials: true }),
                    getUserGameList(user.id)
                ]);

                setProfileData(profileResponse.data);
                setUserGames(userGamesResponse);

                if (profileResponse.data.avatarUrl) {
                    setAvatarSrc(profileResponse.data.avatarUrl);
                } else {
                    const storedAvatarSrc = localStorage.getItem('userAvatarSrc');
                    if (storedAvatarSrc) {
                        setAvatarSrc(storedAvatarSrc);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data');
                enqueueSnackbar('Failed to load user data', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    const handleDelete = async (gameId) => {
        setSelectedGameToDelete(gameId);
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/user-games/${user.id}/${selectedGameToDelete}`);
            setUserGames(prevGames => prevGames.filter(game => game.gameId._id !== selectedGameToDelete));
            enqueueSnackbar('Game removed successfully', { variant: 'success' });
            setIsConfirmationModalOpen(false);
        } catch (error) {
            console.error('Error removing game:', error);
            enqueueSnackbar('Failed to remove game', { variant: 'error' });
        }
    };

    const handleRateClick = (gameId) => {
        const game = userGames.find(g => g.gameId._id === gameId);
        setSelectedGameId(gameId);
        setCurrentGameRating(game?.rating || 0);
        setIsRatingModalOpen(true);
    };

    const handleRateSubmit = async (rating) => {
        try {
            console.log('Submitting rating:', { gameId: selectedGameId, userId: user.id, rating });
            
            const response = await api.post(`/games/user/${selectedGameId}/rate`, { 
                userId: user.id,
                rating: rating
            }, {
                withCredentials: true
            });
            
            console.log('Rating response:', response.data);
            
            setUserGames(prevGames => prevGames.map(game => 
                game.gameId._id === selectedGameId 
                    ? { 
                        ...game, 
                        rating: rating,
                        gameId: {
                            ...game.gameId,
                            averageRating: response.data.averageRating
                        }
                    } 
                    : game
            ));

            enqueueSnackbar(response.data.message, { 
                variant: 'success',
                autoHideDuration: 3000
            });
            
            setIsRatingModalOpen(false);
        } catch (error) {
            console.error('Error rating game:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Failed to submit rating';
            enqueueSnackbar(errorMessage, { 
                variant: 'error',
                autoHideDuration: 4000
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 pt-24 px-4">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="space-y-4 animate-pulse">
                        <div className="h-32 w-32 rounded-full bg-gray-800"></div>
                        <div className="h-4 w-48 bg-gray-800 rounded"></div>
                        <div className="h-4 w-32 bg-gray-800 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 pt-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-block p-6 bg-gray-800 rounded-lg shadow-lg">
                        <div className="text-red-500 text-xl mb-2">⚠️ {error}</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="text-green-400 hover:text-green-300 underline"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gray-900 pt-24 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-gray-400">No profile data available</div>
                </div>
            </div>
        );
    }

    const gamesByStatus = {
        not_started: userGames.filter(game => game.status === 'not_started'),
        ongoing: userGames.filter(game => game.status === 'ongoing'),
        completed: userGames.filter(game => game.status === 'completed'),
        aborted: userGames.filter(game => game.status === 'aborted')
    };

    const statusInfo = {
        not_started: {
            label: 'New Games',
            color: 'border-gray-500',
            bgColor: 'bg-gray-800',
            textColor: 'text-gray-400'
        },
        ongoing: {
            label: 'Currently Playing',
            color: 'border-blue-500',
            bgColor: 'bg-gray-800',
            textColor: 'text-blue-400'
        },
        completed: {
            label: 'Completed',
            color: 'border-green-500',
            bgColor: 'bg-gray-800',
            textColor: 'text-green-400'
        },
        aborted: {
            label: 'Dropped',
            color: 'border-red-500',
            bgColor: 'bg-gray-800',
            textColor: 'text-red-400'
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="mb-12">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4 group">
                            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <img
                                src={avatarSrc || '/defaultAvatar.png'}
                                alt="User Avatar"
                                className="relative w-32 h-32 rounded-full border-4 border-gray-800 shadow-xl"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{profileData.username}</h1>
                        <p className="text-gray-400 text-lg mb-6">
                            {userGames.length} {userGames.length === 1 ? 'game' : 'games'} in collection
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/addgame')}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium
                                    hover:bg-green-600 transition-all duration-300 transform hover:scale-105
                                    flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Game
                            </button>
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="px-6 py-2 bg-gray-700 text-green-400 rounded-lg font-medium
                                    hover:bg-gray-600 transition-all duration-300 transform hover:scale-105
                                    flex items-center gap-2 border border-green-500/20"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Game Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {Object.entries(gamesByStatus).map(([status, games]) => (
                            <div 
                                key={status}
                                className={`p-4 rounded-lg ${statusInfo[status].bgColor} border ${statusInfo[status].color} border-opacity-20`}
                            >
                                <div className={`text-2xl font-bold mb-1 ${statusInfo[status].textColor}`}>
                                    {games.length}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {statusInfo[status].label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Games Grid */}
                <div className="space-y-8">
                    {Object.entries(gamesByStatus).map(([status, games]) => (
                        games.length > 0 && (
                            <div key={status} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                                <h3 className={`text-xl font-semibold mb-6 ${statusInfo[status].textColor}`}>
                                    {statusInfo[status].label}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {games.map(userGame => (
                                        <UserGameCard
                                            key={userGame.gameId._id}
                                            gameId={userGame.gameId._id}
                                            userId={user.id}
                                            onRate={handleRateClick}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {Object.values(gamesByStatus).every(games => games.length === 0) && (
                    <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="mb-4">
                            <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="text-gray-400 text-lg mb-4">Your collection is empty</p>
                        <button
                            onClick={() => navigate('/addgame')}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium
                                hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Add Your First Game
                        </button>
                    </div>
                )}
            </div>

            <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <RatingModal 
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                onSubmit={handleRateSubmit}
                initialRating={currentGameRating}
            />
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Remove Game"
                message="Are you sure you want to remove this game from your list? This action cannot be undone."
            />
        </div>
    );
};

export default UserProfile;