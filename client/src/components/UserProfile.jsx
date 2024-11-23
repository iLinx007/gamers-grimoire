import React, { useEffect, useState, useContext } from 'react';
import api from '../service/axios.mjs'; // Adjust path as necessary
import { AuthContext } from '../context/AuthContext'; // Adjust path as necessary

const UserProfile = () => {
  const { user } = useContext(AuthContext); // Get user information from context
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {

      // Check if user is defined and has an id
      if (!user || !user.id) {
        setError('User not logged in or invalid user ID');
        return;
      }

      try {
        const response = await api.get(`games/user/${user.id}`, { // Ensure this endpoint matches your API
          withCredentials: true,
        });
        
        setProfileData(response.data);
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
    <div className="p-4">
      <h2 className="text-2xl font-bold">{profileData.username}'s Profile</h2>
      {/* Display any other relevant user information here */}
      
      <h3 className="mt-4 text-xl font-semibold">Games List</h3>
      <ul>
        {profileData.gamesList && profileData.gamesList.length > 0 ? (
          profileData.gamesList.map((gameId) => (
            <li key={gameId}>
              {/* Assuming you have a function to fetch game details */}
              Game ID: {gameId} {/* Replace this with actual game title */}
            </li>
          ))
        ) : (
          <li>No games added yet.</li>
        )}
      </ul>
    </div>
  );
};

export default UserProfile;