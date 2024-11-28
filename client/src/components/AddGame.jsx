import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios.mjs';
import { useSnackbar } from 'notistack';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const AddGame = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [addedDate, setAddedDate] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext); // Get user information from context

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

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('genre', genre);
      formData.append('platform', platform);
      formData.append('addedDate', new Date(addedDate).toISOString());
      if (image) {
        formData.append('image', image);
      }
      const response = await api.post('/games/add', formData, {
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
      setPlatform('');
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add a New Game</h2>
        
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {successMessage && <div className="mb-4 text-green-500 text-center">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Genre</label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Platform</label>
            <input
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Date</label>
            <input
              type="date"
              value={addedDate}
              onChange={(e) => setAddedDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Game Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded-lg" />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
          >
            Add Game
          </button>
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
