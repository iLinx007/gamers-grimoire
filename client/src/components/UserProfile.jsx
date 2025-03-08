import React, { useEffect, useState, useContext } from 'react';
import api from '../service/axios.mjs';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserGameCard from './UserGameCard';
import { enqueueSnackbar } from 'notistack';
import { getUserGameList } from '../service/userGameService';

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [userGames, setUserGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [avatarSrc, setAvatarSrc] = useState('');
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
        const confirmDelete = window.confirm('Are you sure you want to remove this game from your list?');
        if (!confirmDelete) return;
        
        try {
            await api.delete(`/user-games/${user.id}/${gameId}`);
            setUserGames(prevGames => prevGames.filter(game => game.gameId._id !== gameId));
            enqueueSnackbar('Game removed successfully', { variant: 'success' });
        } catch (error) {
            console.error('Error removing game:', error);
            enqueueSnackbar('Failed to remove game', { variant: 'error' });
        }
    };

    const handleRate = async (gameId) => {
        const rating = prompt('Rate this game from 1 to 5:');

        if (!rating || isNaN(rating) || rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            enqueueSnackbar('Please enter a valid rating between 1 and 5.', { variant: 'warning' });
            return;
        }

        try {
            const response = await api.post(`/games/${gameId}/rate`, { 
                userId: user.id,
                rating: Number(rating)
            });
            enqueueSnackbar(response.data.message, { variant: 'success' });
            
            setUserGames(prevGames => prevGames.map(game => 
                game.gameId._id === gameId 
                    ? { ...game, rating: Number(rating) } 
                    : game
            ));
        } catch (error) {
            console.error('Error rating game:', error);
            enqueueSnackbar('Failed to rate game', { variant: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
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

    if (!profileData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">No profile data available</div>
            </div>
        );
    }

    // Group games by status
    const gamesByStatus = {
        ongoing: userGames.filter(game => game.status === 'ongoing'),
        completed: userGames.filter(game => game.status === 'completed'),
        not_started: userGames.filter(game => game.status === 'not_started'),
        aborted: userGames.filter(game => game.status === 'aborted')
    };

    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">{profileData.username}'s Hub</h2>

            <img
                src={avatarSrc || '/default-avatar.jpg'}
                alt={`${profileData.username}'s avatar`}
                className="w-24 h-24 rounded-full mb-6 border-2 border-gray-300"
            />

            <div className="w-full max-w-7xl">
                {Object.entries(gamesByStatus).map(([status, games]) => (
                    games.length > 0 && (
                        <div key={status} className="mb-8">
                            <h3 className="text-xl font-semibold capitalize mb-4">
                                {status.replace('_', ' ')} Games ({games.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {games.map(userGame => (
                                    <UserGameCard
                                        key={userGame.gameId._id}
                                        gameId={userGame.gameId._id}
                                        userId={user.id}
                                        onRate={handleRate}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                ))}

                {Object.values(gamesByStatus).every(games => games.length === 0) && (
                    <div className="text-center text-gray-500 my-8">
                        No games in your list yet. Add some games to get started!
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/addgame')}
                className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
                Add Game
            </button>
        </div>
    );
};

export default UserProfile;