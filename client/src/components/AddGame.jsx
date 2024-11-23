import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../service/axios.mjs'; // Adjust path as necessary

const AddGame = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      // Format the release date to ISO string
      const formattedReleaseDate = new Date(releaseDate).toISOString();

      const response = await api.post('/games/add',
        {
          title,
          description,
          genre,
          platform,
          releaseDate: formattedReleaseDate,
        },
        { 
          withCredentials: true // Include credentials for cookie-based auth
        }
      );

      setSuccessMessage(response.data.message); // Display success message
      // Clear form fields after submission
      setTitle('');
      setDescription('');
      setGenre('');
      setPlatform('');
      setReleaseDate('');
      navigate(-1);
    } catch (error) {
      console.error('Error adding game:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to add game. Please try again.');
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
            <label className="block text-gray-700 font-semibold mb-1">Release Date</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

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