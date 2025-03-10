import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios.mjs';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const AddGame = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
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
  const [platforms, setPlatforms] = useState({
    PC: false,
    XBOX: false,
    Playstation: false,
    Nintendo: false
  });
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [addedDate, setAddedDate] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const [image, setImage] = useState(null);


  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const handlePlatformChange = (platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const getSelectedPlatforms = () => {
    return Object.entries(platforms)
      .filter(([_, isSelected]) => isSelected)
      .map(([platform]) => platform);
  };

  const getSelectedPlatformsText = () => {
    const selected = getSelectedPlatforms();
    if (selected.length === 0) return 'Select Platforms';
    return selected.join(', ');
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('Image size should be less than 5MB', { variant: 'error' });
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const selectedPlatforms = getSelectedPlatforms();
    if (selectedPlatforms.length === 0) {
      enqueueSnackbar('Please select at least one platform', { variant: 'warning' });
      return;
    }

    try {
      let uploadedImageURL = '';

      if (image) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', image);
        cloudinaryFormData.append('upload_preset', 'gamer\'s_grimoire');

        const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, cloudinaryFormData);
        //console.log(cloudinaryResponse);
        uploadedImageURL = cloudinaryResponse.data.secure_url;
        setImage(uploadedImageURL);
      }

      const gameData = new FormData();
      gameData.append('title', title);
      gameData.append('description', description);
      gameData.append('genre', genre);
      gameData.append('platform', JSON.stringify(selectedPlatforms));
      gameData.append('addedDate', new Date(addedDate).toISOString());
      gameData.append('image', uploadedImageURL);
      
      const response = await api.post('/games/add', gameData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await api.post(`/games/users/${user.id}/add-game`, { gameId: response.data.gameId }, {
        withCredentials: true
      });

      setSuccessMessage('Game added successfully and added to your list!');
      enqueueSnackbar('Game added successfully and added to your list!', { variant: 'success' });
      
      // Clear form fields after submission
      setTitle('');
      setDescription('');
      setGenre('');
      setPlatforms({
        PC: false,
        XBOX: false,
        Playstation: false,
        Nintendo: false
      });
      setAddedDate('');
      setImage(null);
      setImagePreview(null);
      
      // Navigate back to the previous page
      navigate(-1);
    } catch (error) {
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.error('Error adding game:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add game. Please try again.');
      enqueueSnackbar('Failed to add game. Please try again.', { variant: 'error' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 max-w-lg animate-scale-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400 animate-fade-in">
          Add a New Game
        </h2>
        
        {error && (
          <div className="mb-4 text-red-500 text-center animate-fade-in">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-green-500 text-center animate-fade-in">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 stagger-children">
          <div className="transform transition-all duration-300 hover:translate-x-2">
            <label className="block text-gray-300 font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300"
            />
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-2">
            <label className="block text-gray-300 font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300 min-h-[100px]"
            />
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-2">
            <label className="block text-gray-300 font-semibold mb-1">Genre</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                  transition-all duration-300 text-left"
              >
                {genre || 'Select Genre'}
              </button>
              
              {showGenreDropdown && (
                <div className="absolute left-0 w-full bg-gray-700 border border-gray-600 
                  rounded-md shadow-lg z-10 bottom-full mb-1 max-h-60 overflow-y-auto animate-fade-in">
                  {genres.map((genreOption) => (
                    <div
                      key={genreOption}
                      className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white transition-colors duration-200"
                      onClick={() => {
                        setGenre(genreOption);
                        setShowGenreDropdown(false);
                      }}
                    >
                      {genreOption}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-2">
            <label className="block text-gray-300 font-semibold mb-1">Platforms</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                  transition-all duration-300 text-left"
              >
                {getSelectedPlatformsText()}
              </button>
              
              {showPlatformDropdown && (
                <div className="absolute left-0 w-full bg-gray-700 border border-gray-600 
                  rounded-md shadow-lg z-10 bottom-full mb-1 animate-fade-in">
                  {Object.keys(platforms).map((platform) => (
                    <label
                      key={platform}
                      className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer text-white transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={platforms[platform]}
                        onChange={() => handlePlatformChange(platform)}
                        className="form-checkbox h-4 w-4 text-green-500 rounded focus:ring-green-400"
                      />
                      <span className="ml-2">{platform}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-2">
            <label className="block text-gray-300 font-semibold mb-1">Date</label>
            <input
              type="date"
              value={addedDate}
              onChange={(e) => setAddedDate(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300"
            />
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-2">
            <label className="block text-gray-300 font-semibold mb-1">Game Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent
                transition-all duration-300"
            />
          </div>

          {imagePreview && (
            <div className="mt-2 animate-scale-in">
              <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg shadow-xl" />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold 
                hover:bg-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Add Game
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 py-2 bg-gray-600 text-white rounded-lg font-semibold 
                hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGame;














// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../service/axios.mjs'; // Adjust path as necessary
// import { useSnackbar } from 'notistack';

// const AddGame = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [genre, setGenre] = useState('');
//   const [platform, setPlatform] = useState('');
//   const [addedDate, setAddedDate] = useState('');
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const navigate = useNavigate();
//   const { enqueueSnackbar } = useSnackbar();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccessMessage(null);

//     try {
//       // Format the release date to ISO string
//       const formattedAddedDate = new Date(addedDate).toISOString();

//       const response = await api.post('/games/add',
//         {
//           title,
//           description,
//           genre,
//           platform,
//           addedDate: formattedAddedDate,
          
//         },
//         { 
//           withCredentials: true // Include credentials for cookie-based auth
//         }
//       );

//       setSuccessMessage(response.data.message); // Display success message
//       enqueueSnackbar(response.data.message, { variant: 'success' });
//       // Clear form fields after submission
//       setTitle('');
//       setDescription('');
//       setGenre('');
//       setPlatform('');
//       setAddedDate('');
//       navigate(-1);
//     } catch (error) {
//       console.error('Error adding game:', error.response?.data || error.message);
//       setError(error.response?.data?.message || 'Failed to add game. Please try again.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add a New Game</h2>
        
//         {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
//         {successMessage && <div className="mb-4 text-green-500 text-center">{successMessage}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">Genre</label>
//             <input
//               type="text"
//               value={genre}
//               onChange={(e) => setGenre(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">Platform</label>
//             <input
//               type="text"
//               value={platform}
//               onChange={(e) => setPlatform(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-semibold mb-1">Date</label>
//             <input
//               type="date"
//               value={addedDate}
//               onChange={(e) => setAddedDate(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
//           >
//             Add Game
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddGame;
