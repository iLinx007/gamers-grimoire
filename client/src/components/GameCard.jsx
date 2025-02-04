
// export default GameCard;
import React from 'react';

const GameCard = ({ game, onAdd }) => {
  // const imagePath = game.imageUrl
  //   ? `${import.meta.env.VITE_APP_BACKEND_URL}/${game.image}`
  //   : '/defaultGame.jpg';

  const imagePath = game.image ? game.image : '/defaultGame.jpg';

  return (
    <div className="bg-white rounded-lg shadow-2xl hover:shadow-[0px_8px_30px_rgba(0,0,0,0.5)] transition-shadow duration-300 ease-in-out overflow-hidden">
      {/* Image Section */}
      <img
        src={imagePath}
        alt={game.title}
        className="w-full h-48 object-cover"
      />
      {/* Text Content Section */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{game.title}</h3>
        <p className="text-gray-700 mb-2">
          <strong>Genre:</strong> {game.genre.join(', ')}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Platforms:</strong> {game.platform.join(', ')}
        </p>
        <p className="text-gray-600 text-sm mb-2">
          {game.description.substring(0, 100)}...
        </p>
        <p className="text-sm text-gray-500">
          <strong>Average Rating:</strong>{' '}
          <span className="text-yellow-500">{game.averageRating.toFixed(2)}</span>
        </p>
      </div>

      <div className="mt-4 flex justify-center pb-2">
          <button onClick={() => onAdd(game._id)} className="px-2 py-1 text-sm bg-green-500 text-black rounded hover:bg-green-600 transition duration-200">Add to my list</button>
        </div>
    </div>
  );
};

export default GameCard;
