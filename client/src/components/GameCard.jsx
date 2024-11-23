import React from 'react';

const GameCard = ({ game }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={game.imageUrl} alt={game.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
        <p className="text-gray-600 mb-2">{game.genre}</p>
        <p className="text-sm text-gray-500">{game.description.substring(0, 100)}...</p>
      </div>
    </div>
  );
};

export default GameCard;