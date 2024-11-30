// import React, { useEffect, useState, useContext } from 'react';
// import api from '../service/axios.mjs'; // Adjust path as necessary
// import { AuthContext } from '../context/AuthContext'; // Adjust path as necessary

// const UserProfile = () => {
//   const { user } = useContext(AuthContext); // Get user information from context
//   const [profileData, setProfileData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUserProfile = async () => {

//       // Check if user is defined and has an id
//       if (!user || !user.id) {
//         setError('User not logged in or invalid user ID');
//         return;
//       }

//       try {
//         const response = await api.get(`games/user/${user.id}`, { // Ensure this endpoint matches your API
//           withCredentials: true,
//         });

//         setProfileData(response.data);
//       } catch (error) {
//         console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
//         setError('Failed to load user profile');
//       }
//     };

//     fetchUserProfile();
//   }, [user]);

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   if (!profileData) {
//     return <div>Loading...</div>; // Show loading state while fetching data
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold">{profileData.username}'s Profile</h2>
//       {/* Display any other relevant user information here */}

//       <h3 className="mt-4 text-xl font-semibold">Games List</h3>
//       <ul>
//         {profileData.gamesList && profileData.gamesList.length > 0 ? (
//           profileData.gamesList.map((gameId) => (
//             <li key={gameId}>
//               {/* Assuming you have a function to fetch game details */}
//               Game ID: {gameId} {/* Replace this with actual game title */}
//             </li>
//           ))
//         ) : (
//           <li>No games added yet.</li>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default UserProfile;






import React, { useEffect, useState, useContext } from 'react';
import api from '../service/axios.mjs'; // Adjust path as necessary
import { AuthContext } from '../context/AuthContext'; // Adjust path as necessary
import { useNavigate } from 'react-router-dom';
import UserGameCard from './UserGameCard';
import { enqueueSnackbar } from 'notistack';

const UserProfile = () => {
    const { user } = useContext(AuthContext); // Get user information from context
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [avatarSrc, setAvatarSrc] = useState(''); // State for avatar source
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            // Check if user is defined and has an id
            if (!user || !user.id) {
                setError('User not logged in or invalid user ID');
                return;
            }

            try {
                const response = await api.get(`games/user/${user.id}`, { // Fetch user profile including gamesList
                    withCredentials: true,
                });

                setProfileData(response.data); // Assuming response.data contains user info including gamesList

                // Set the avatar source from the fetched profile data or fallback to local storage
                if (response.data.avatarUrl) {
                    setAvatarSrc(response.data.avatarUrl);
                } else {
                    const storedAvatarSrc = localStorage.getItem('userAvatarSrc');
                    if (storedAvatarSrc) {
                        setAvatarSrc(storedAvatarSrc);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
                setError('Failed to load user profile');
            }
        };

        fetchUserProfile();
    }, [user]);


    const handleDelete = async (gameId) => {

        const confirmDelete = window.confirm('Are you sure you want to delete this game?');
        if (!confirmDelete) return;
        try {
            const result = await api.delete(`/games/user/${gameId}/delete`);
            setProfileData(prevData => {
                if (!prevData || !prevData.gamesList) {
                    console.error('Profile data is undefined or empty.');
                    return prevData;
                }
                return {
                    ...prevData,
                    gamesList: prevData.gamesList.filter(game => game._id !== gameId),
                };
            });
            navigate(0);
            enqueueSnackbar('Game removed successfully', { variant: 'success' });

        } catch (error) {
            console.error('Error deleting game:', error);
            enqueueSnackbar('Failed to delete game', { variant: 'error' });
            setError('Failed to delete game');
        }
    };

    const handleRate = async (gameId) => {
        const rating = prompt('Rate this game from 1 to 5:');

        // Validate input
        if (!rating || isNaN(rating) || rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
            enqueueSnackbar('Please enter a valid rating between 1 and 5.', { variant: 'warning' });
            return;
        }

        try {
            // Send the rating to the server
            const response = await api.post(`/games/user/${gameId}/rate`, { rating: Number(rating) });
            // Optimistically update the local state
            enqueueSnackbar(response.data.message, { variant: 'success' });
            setProfileData(prevData => {
                if (!prevData || !prevData.gamesList) return prevData;

                return {
                    ...prevData,
                    gamesList: prevData.gamesList.map(game =>
                        game._id === gameId ? { ...game, rating: Number(rating) } : game
                    ),
                };
            });

        } catch (error) {
            console.error('Error rating game:', error);
            enqueueSnackbar('Failed to rate game. Please try again later.', { variant: 'error' });
        }
    };


    const handleComplete = async (gameId) => {
        try {
            await api.put(`/games/user/${gameId}/complete`, { userId: user.id });
            setProfileData(prevData => ({
                ...prevData,
                gamesList: prevData.gamesList.map(game =>
                    game._id === gameId ? { ...game, completed: !game.completed } : game
                )
            }));
        } catch (error) {
            console.error('Error updating game completion status:', error);
            setError('Failed to update game completion status');
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold">{profileData.username}'s Hub</h2>

            {/* Display user's avatar */}
            <img
                src={avatarSrc || 'default-avatar-url.jpg'} // Use a default avatar if not provided
                alt={`${profileData.username}'s avatar`}
                className="w-24 h-24 rounded-full mt-2 mb-4 border-2 border-gray-300" // Add margin and border for better visibility
            />

            <h3 className="mt-4 text-xl font-semibold">Games List</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {/* <ul className="w-full"> */}
                {profileData.gamesList && profileData.gamesList.length > 0 ? (
                    profileData.gamesList.map((gameId) => (
                        <div key={gameId}>
                            {/* Fetch game details for each game ID */}
                            <UserGameCard
                                gameId={gameId}
                                onComplete={handleComplete}
                                onRate={handleRate}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))
                ) : (
                    <li>No games added yet.</li>
                )}
                {/* </ul> */}
            </div>
            <button
                onClick={() => navigate('/addgame')} // Navigate to Add Game page
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Add Game
            </button>
        </div>
    );
};

// const GameCard = ({ gameId }) => {
//     const [game, setGame] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchGameDetails = async () => {
//             try {
//                 const response = await api.get(`/games/${gameId}`); // Fetch game details using the game ID
//                 setGame(response.data);
//             } catch (error) {
//                 console.error('Error fetching game details:', error);
//                 setError('Failed to load game details');
//             }
//         };

//         fetchGameDetails();
//     }, [gameId]);

//     if (error) {
//         return <div className="text-red-500">{error}</div>;
//     }

//     if (!game) {
//         return <div>Loading game details...</div>; // Show loading state while fetching game data
//     }

//     return (
//         <div className="border rounded-lg p-4 shadow-md bg-white mt-2">
//             <h4 className="font-semibold">{game.title}</h4>
//             <p>{game.description.substring(0, 100)}...</p> {/* Truncate description */}
//         </div>
//     );
// };

export default UserProfile;