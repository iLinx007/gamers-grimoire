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
            <ul className="w-full">
                {profileData.gamesList && profileData.gamesList.length > 0 ? (
                    profileData.gamesList.map((gameId) => (
                        <li key={gameId}>
                            {/* Fetch game details for each game ID */}
                            <GameCard gameId={gameId} /> {/* You might want to create a GameCard component to display game details */}
                        </li>
                    ))
                ) : (
                    <li>No games added yet.</li>
                )}
            </ul>
            <button
                onClick={() => navigate('/addgame')} // Navigate to Add Game page
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Add Game
            </button>
        </div>
    );
};

const GameCard = ({ gameId }) => {
    const [game, setGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await api.get(`/games/${gameId}`); // Fetch game details using the game ID
                setGame(response.data);
            } catch (error) {
                console.error('Error fetching game details:', error);
                setError('Failed to load game details');
            }
        };

        fetchGameDetails();
    }, [gameId]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!game) {
        return <div>Loading game details...</div>; // Show loading state while fetching game data
    }

    return (
        <div className="border rounded-lg p-4 shadow-md bg-white mt-2">
            <h4 className="font-semibold">{game.title}</h4>
            <p>{game.description.substring(0, 100)}...</p> {/* Truncate description */}
        </div>
    );
};

export default UserProfile;