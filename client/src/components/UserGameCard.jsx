// import React from 'react';

// const UserGameCard = ({ game, onDelete, onRate, onComplete }) => {
//   // Safely access nested properties
//   const getImagePath = () => {
//     if (game && game.image) {
//       return `/uploads/${game.image.replace(/^uploads\\/, '').replace(/\\/g, '/')}`;
//     }
//     return '/defaultGame.jpg';
//   };

//   // Check if game object exists before rendering
//   if (!game) {
//     return <div>Loading game data...</div>;
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <img 
//         src={getImagePath()}
//         alt={game.title || 'Game'} 
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-xl font-semibold mb-2">{game.title || 'Untitled Game'}</h3>
//         <p className="text-gray-600 mb-2">
//           <strong>Genre:</strong> {Array.isArray(game.genre) ? game.genre.join(', ') : 'N/A'}
//         </p>
//         <p className="text-gray-600 mb-2">
//           <strong>Platforms:</strong> {Array.isArray(game.platform) ? game.platform.join(', ') : 'N/A'}
//         </p>
//         <p className="text-sm text-gray-500 mb-2">
//           {game.description ? `${game.description.substring(0, 100)}...` : 'No description available'}
//         </p>

//         <div className="mt-4 flex justify-between">
//           <button 
//             onClick={() => onDelete(game._id)} 
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
//           >
//             Delete
//           </button>
//           <button 
//             onClick={() => onRate(game._id)} 
//             className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
//           >
//             Rate
//           </button>
//           <button 
//             onClick={() => onComplete(game._id)} 
//             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
//           >
//             Complete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserGameCard;




import React, { useState, useEffect } from 'react';
import api from '../service/axios.mjs'; // Adjust this import path as needed

const UserGameCard = ({ gameId, onDelete, onRate, onComplete }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${gameId}`);
        setGame(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game:', err);
        setError('Failed to load game data');
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  if (loading) return <div>Loading game data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!game) return <div>No game data available</div>;

  const imagePath = game.image
    ? `${import.meta.env.VITE_APP_BACKEND_URL}/${game.image}`
    : '/defaultGame.jpg';

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
        <p className="text-sm text-gray-500 mb-2">{game.description ? `${game.description.substring(0, 100)}...` : 'No description available'}</p>
        <p className="text-sm text-gray-500 mb-2"><strong>Status:</strong> {game.completed ? 'Completed' : 'In Progress'}</p>
        <div className="mt-4 flex justify-between">
          <button onClick={() => onComplete(game._id)} className="px-2 py-1 text-sm bg-green-500 text-black rounded hover:bg-green-600 transition duration-200">{game.completed ? 'Uncomplete' : 'Complete'}</button>
          <button onClick={() => onRate(game._id)} className="px-2 py-1 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-600 transition duration-200">Rate</button>
          <button onClick={() => onDelete(game._id)} className="px-2 py-1 text-sm bg-red-500 text-black rounded hover:bg-red-600 transition duration-200">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default UserGameCard;






















{/* <div className="bg-white rounded-lg shadow-2xl hover:shadow-[0px_8px_30px_rgba(0,0,0,0.5)] transition-shadow duration-300 ease-in-out overflow-hidden">
  <img
    src={imagePath}
    alt={game.title || 'Game'}
    className="w-full h-48 object-cover"
  />
  <div className="p-4">
    <h3 className="text-xl font-semibold mb-2">{game.title || 'Untitled Game'}</h3>
    <p className="text-gray-600 mb-2"><strong>Genre:</strong> {Array.isArray(game.genre) ? game.genre.join(', ') : 'N/A'} </p>
    <p className="text-gray-600 mb-2"><strong>Platforms:</strong> {Array.isArray(game.platform) ? game.platform.join(', ') : 'N/A'}</p>
    <p className="text-sm text-gray-500 mb-2">{game.description ? `${game.description.substring(0, 100)}...` : 'No description available'}</p>
    <p className="text-sm text-gray-500 mb-2"><strong>Status:</strong> {game.completed ? 'Completed' : 'In Progress'}</p>
    <div className="mt-4 flex justify-between">
      <button onClick={() => onComplete(game._id)} className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">{game.completed ? 'Uncomplete' : 'Complete'}</button>
      <button onClick={() => onRate(game._id)} className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200">Rate</button>
      <button onClick={() => onDelete(game._id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition duration-200">Delete</button>
    </div>
  </div>
</div> */}
