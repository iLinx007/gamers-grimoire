import React, { useEffect, useState, useContext } from 'react';
import api from '../service/axios.mjs'; // Adjust path as necessary
import GameCard from './GameCard'; // Import the GameCard component
import { enqueueSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext';
import { addGameToList } from '../service/userGameService';

const Games = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useContext(AuthContext);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const genres = [
    'Action',
    'Adventure',
    'RPG',
    'Strategy',
    'Sports',
    'Racing',
    'Simulation',
    'Puzzle',
    'Horror',
    'Fighting',
    'Shooter',
    'Platformer',
    'MMORPG',
    'Battle Royale'
  ];

  const platforms = [
    'PC',
    'XBOX',
    'Playstation',
    'Nintendo'
  ];

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games/all');
        // Parse the genre and platform arrays if they're strings
        const parsedGames = response.data.map(game => ({
          ...game,
          genre: Array.isArray(game.genre) ? game.genre : JSON.parse(game.genre || '[]'),
          platform: Array.isArray(game.platform) ? game.platform : JSON.parse(game.platform || '[]')
        }));
        console.log('Sample game platforms:', parsedGames[0]?.platform);
        setGames(parsedGames);
        setFilteredGames(parsedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError('Failed to load games');
        enqueueSnackbar('Failed to load games', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    // Filter games based on search term, genre, and platform
    let filtered = [...games];
    
    console.log('Initial games:', games.length);
    console.log('Current filters:', { searchTerm, selectedGenre, selectedPlatform, selectedRating });

    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After title filter:', filtered.length);
    }

    if (selectedGenre) {
      filtered = filtered.filter(game => {
        const gameGenres = Array.isArray(game.genre) ? game.genre : [];
        const matches = gameGenres.some(g => g.toLowerCase() === selectedGenre.toLowerCase());
        return matches;
      });
      console.log('After genre filter:', filtered.length);
    }

    if (selectedPlatform) {
      filtered = filtered.filter(game => {
        const gamePlatforms = Array.isArray(game.platform) ? game.platform : [];
        console.log('Game:', game.title);
        console.log('Game platforms:', gamePlatforms);
        console.log('Selected platform:', selectedPlatform);
        
        // Try different matching strategies
        const exactMatch = gamePlatforms.includes(selectedPlatform);
        const caseInsensitiveMatch = gamePlatforms.some(p => 
          p.toLowerCase() === selectedPlatform.toLowerCase()
        );
        const partialMatch = gamePlatforms.some(p => 
          p.toLowerCase().includes(selectedPlatform.toLowerCase()) ||
          selectedPlatform.toLowerCase().includes(p.toLowerCase())
        );
        
        console.log('Matches:', {
          exact: exactMatch,
          caseInsensitive: caseInsensitiveMatch,
          partial: partialMatch
        });
        
        return caseInsensitiveMatch || partialMatch;
      });
      console.log('After platform filter:', filtered.length);
    }

    if (selectedRating > 0) {
      filtered = filtered.filter(game => {
        // Round to nearest 0.5 for comparison
        const roundedRating = Math.round((game.averageRating || 0) * 2) / 2;
        return roundedRating >= selectedRating;
      });
      console.log('After rating filter:', filtered.length);
    }

    console.log('Final filtered games:', filtered.length);
    setFilteredGames(filtered);
  }, [searchTerm, selectedGenre, selectedPlatform, selectedRating, games]);

  const handleAddToList = async (gameId) => {
    if (!user || !user.id) {
      enqueueSnackbar('Please log in to add games to your list', { variant: 'warning' });
      return;
    }

    try {
      await addGameToList(user.id, gameId);
      enqueueSnackbar('Game added to your list successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error adding game to list:', error);
      if (error.response?.status === 400 && error.response?.data?.message === 'Game already in user\'s list') {
        enqueueSnackbar('This game is already in your list', { variant: 'info' });
      } else {
        enqueueSnackbar('Failed to add game to your list', { variant: 'error' });
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedPlatform('');
    setSelectedRating(0);
    setShowGenreDropdown(false);
    setShowPlatformDropdown(false);
  };

  // Add click outside handler to close filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && !event.target.closest('.filters-section') && !event.target.closest('.filter-toggle')) {
        setShowFilters(false);
        setShowGenreDropdown(false);
        setShowPlatformDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  const StarRating = ({ rating, onSelect }) => {
    const [hover, setHover] = useState(0);
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="p-1 focus:outline-none"
            onClick={() => onSelect(star === rating ? 0 : star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <svg
              className={`w-5 h-5 ${
                star <= (hover || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-500'
              } transition-colors duration-150`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {rating > 0 && (
          <button
            onClick={() => onSelect(0)}
            className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
            title="Clear rating filter"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400 animate-pulse">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500 animate-fade-in">{error}</div>
      </div>
    );
  }

  if (!games.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400 animate-fade-in">No games available</div>
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in">
      {/* Filter Toggle Button */}
      <div className="sticky top-0 z-20 bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-400 animate-slide-in">
            Games Library
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle p-1.5 text-white bg-gray-700 rounded-lg hover:bg-gray-600 
              transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 
              focus:ring-green-400 text-sm"
            title="Toggle filters"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
              />
            </svg>
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">{showFilters ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        {/* Filters Section */}
        <div className={`filters-section container mx-auto px-4 overflow-hidden transition-all duration-300 
          ${showFilters ? 'max-h-[28rem] sm:max-h-72 opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-800 rounded-lg p-3 sm:p-4 shadow-lg border border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Genre Filter */}
              <div className="relative">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setShowGenreDropdown(!showGenreDropdown);
                      setShowPlatformDropdown(false);
                    }}
                    className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 text-white rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                      transition-all duration-300 text-left text-sm"
                  >
                    {selectedGenre || 'Select Genre'}
                  </button>
                  {selectedGenre && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGenre('');
                      }}
                      className="ml-1 p-1.5 text-gray-400 hover:text-white transition-colors"
                      title="Clear genre filter"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {showGenreDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-gray-700 border border-gray-600 
                    rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto text-sm">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => {
                          setSelectedGenre(genre);
                          setShowGenreDropdown(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-white hover:bg-gray-600 transition-colors"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Filter */}
              <div className="relative">
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setShowPlatformDropdown(!showPlatformDropdown);
                      setShowGenreDropdown(false);
                    }}
                    className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 text-white rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                      transition-all duration-300 text-left text-sm"
                  >
                    {selectedPlatform || 'Select Platform'}
                  </button>
                  {selectedPlatform && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlatform('');
                      }}
                      className="ml-1 p-1.5 text-gray-400 hover:text-white transition-colors"
                      title="Clear platform filter"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {showPlatformDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-gray-700 border border-gray-600 
                    rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto text-sm">
                    {platforms.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => {
                          setSelectedPlatform(platform);
                          setShowPlatformDropdown(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-white hover:bg-gray-600 transition-colors"
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="relative">
                <div className="flex items-center">
                  <div className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400 mr-2">
                        {selectedRating ? `${selectedRating}+ Stars` : 'Rating'}
                      </div>
                      <StarRating rating={selectedRating} onSelect={setSelectedRating} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600
                  transition-all duration-300 border border-gray-600 focus:outline-none
                  focus:ring-2 focus:ring-green-400 flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-2 text-gray-400 text-sm">
              Showing {filteredGames.length} of {games.length} games
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Games Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 stagger-children">
          {filteredGames.map(game => (
            <GameCard key={game._id} game={game} onAdd={handleAddToList} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredGames.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg">
              No games found matching your filters
            </div>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg
                hover:bg-green-600 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;