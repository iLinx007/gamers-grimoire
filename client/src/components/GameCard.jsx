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
          relative bg-white rounded-lg shadow-2xl 
          transition-all duration-500 ease-out
          ${isExpanded ? 
            'transform scale-110 rotate-0 translate-y-0 z-30 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 
            'transform scale-100 rotate-0 translate-y-0 hover:scale-105'
          }
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={imagePath}
            alt={game.title}
            className={`
              w-full h-48 object-cover 
              transition-all duration-500
              ${isExpanded ? 'transform scale-110' : 'transform scale-100 hover:scale-110'}
            `}
          />
          <div 
            className={`
              absolute inset-0 bg-black
              transition-all duration-500 ease-in-out
              ${isExpanded ? 'bg-opacity-50' : 'bg-opacity-0'}
              flex items-center justify-center
            `}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAdd(game._id);
              }}
              className={`
                px-4 py-2 bg-green-500 text-white rounded-lg
                transition-all duration-500 transform
                hover:bg-green-600 hover:scale-105 hover:shadow-lg
                ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
            >
              Add to List
            </button>
          </div>
        </div>

        <div 
          className={`
            p-4 transition-all duration-500
            ${isExpanded ? 'bg-gray-50' : 'bg-white'}
          `}
        >
          <h3 className={`
            text-xl font-semibold text-gray-800 mb-2
            transition-all duration-500
            ${isExpanded ? 'transform translate-x-0' : 'transform translate-x-0'}
          `}>
            {game.title}
          </h3>
          
          <div className="space-y-2">
            <p className={`
              text-gray-700 transition-all duration-500
              ${isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-100 transform translate-y-0'}
            `}>
              <strong>Genre:</strong> {game.genre.join(', ')}
            </p>
            <p className={`
              text-gray-700 transition-all duration-500 delay-75
              ${isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-100 transform translate-y-0'}
            `}>
              <strong>Platforms:</strong> {game.platform.join(', ')}
            </p>
            
            <div className={`
              overflow-hidden transition-all duration-500 ease-in-out
              ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-16 opacity-90'}
            `}>
              <p className="text-gray-600 text-sm">
                {isExpanded ? game.description : `${game.description.substring(0, 100)}...`}
              </p>
            </div>

            <div className={`
              transition-all duration-500 delay-100
              ${isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}
            `}>
              <p className="text-sm text-gray-500">
                <strong>Average Rating:</strong>{' '}
                <span className="text-yellow-500">{game.averageRating.toFixed(2)} ★</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
