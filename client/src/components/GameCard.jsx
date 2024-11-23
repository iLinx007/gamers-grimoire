import React from 'react';

const GameCard = ({ game }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Assuming you have an image URL in your game object */}
      <img src={game.imageUrl || 'default-image-url.jpg'} alt={game.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
        <p className="text-gray-600 mb-2"><strong>Genre:</strong> {game.genre.join(', ')}</p>
        <p className="text-gray-600 mb-2"><strong>Platforms:</strong> {game.platform.join(', ')}</p>
        <p className="text-sm text-gray-500 mb-2">{game.description.substring(0, 100)}...</p>
        <p className="text-sm text-gray-500"><strong>Average Rating:</strong> {game.averageRating.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default GameCard;