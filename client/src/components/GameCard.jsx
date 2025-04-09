// export default GameCard;
import React, { useState } from 'react';

const GameCard = ({ game, onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // const imagePath = game.imageUrl
  //   ? `${import.meta.env.VITE_APP_BACKEND_URL}/${game.image}`
  //   : '/defaultGame.jpg';

  const imagePath = game.image ? game.image : '/defaultGame.jpg';

  return (
    <div className="relative group">
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-all duration-500 ${
          isExpanded ? 'bg-opacity-50 backdrop-blur-sm z-20' : 'bg-opacity-0 backdrop-blur-none -z-10'
        }`}
        onClick={() => setIsExpanded(false)}
      />

      <div
        className={`
          relative bg-gray-800 rounded-lg shadow-lg
          transition-all duration-500 ease-out
          ${isExpanded ? 
            'transform scale-105 sm:scale-110 rotate-0 translate-y-0 z-30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 
            'transform scale-100 rotate-0 translate-y-0 hover:scale-105'
          }
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-t-lg aspect-[4/3]">
          <img
            src={imagePath}
            alt={game.title}
            className={`
              w-full h-full object-cover 
              transition-all duration-500
              ${isExpanded ? 'transform scale-110' : 'transform scale-100 hover:scale-110'}
            `}
            loading="lazy"
          />
          <div 
            className={`
              absolute inset-0 bg-black
              transition-all duration-500 ease-in-out flex items-center justify-center
              ${isExpanded ? 'bg-opacity-60' : 'bg-opacity-0'}
            `}
          >
            {isExpanded && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(game._id);
                }}
                className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg
                  transition-all duration-500 transform
                  hover:bg-green-600 hover:scale-105 hover:shadow-lg
                  opacity-100 translate-y-0"
              >
                Add to List
              </button>
            )}
          </div>
        </div>

        {/* Game Info */}
        <div className="p-3 space-y-1">
          <h3 className="text-base font-semibold text-white line-clamp-1" title={game.title}>
            {game.title}
          </h3>
          
          <div className="space-y-1 text-sm">
            <p className="text-gray-300 line-clamp-1" title={game.genre.join(', ')}>
              <span className="text-gray-400">Genre:</span> {game.genre.join(', ')}
            </p>
            <p className="text-gray-300 line-clamp-1" title={game.platform.join(', ')}>
              <span className="text-gray-400">Platforms:</span> {game.platform.join(', ')}
            </p>
            
            {/* Description (only shown when expanded) */}
            <div className={`
              overflow-hidden transition-all duration-500
              ${isExpanded ? 'max-h-24' : 'max-h-0'}
            `}>
              <p className="text-gray-400 text-sm line-clamp-3">
                {game.description}
              </p>
            </div>

            <div className={`
              transition-all duration-500
              ${isExpanded ? 'opacity-100' : 'opacity-0 h-0'}
            `}>
              <p className="text-sm">
                <span className="text-gray-400">Rating:</span>{' '}
                <span className="text-yellow-500">{game.averageRating.toFixed(1)} ★</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
