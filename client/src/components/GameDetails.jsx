import React, { useEffect, useState } from 'react';
import api from '../service/axios.mjs'; // Adjust path as necessary
import { useParams } from 'react-router-dom';

const GameDetails = () => {
  const { gameId } = useParams(); // Get the game ID from the URL
  const [game, setGame] = useState(null); // To store game details
  const [rating, setRating] = useState(''); // To store user rating input
  const [feedback, setFeedback] = useState(''); // To store feedback input
  const [error, setError] = useState(null); // To handle any error messages

  useEffect(() => {
    // Fetch game details when the component loads
    const fetchGameDetails = async () => {
      try {
        const response = await api.get(`games/${gameId}`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setGame(response.data); // Assuming response.data contains the game object
      } catch (error) {
        console.error('Error fetching game details:', error);
        setError('Failed to load game details');
      }
    };
    fetchGameDetails();
  }, [gameId]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        `games/${gameId}/rate`,
        { rating, feedback },
        { withCredentials: true } // Send cookies with the request
      );
      setGame(response.data); // Update game details with the new rating
      setRating(''); // Clear input fields after submitting
      setFeedback('');
      setError(null);
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>; // Styled error message
  }

  if (!game) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{game.title}</h2>
      <p>{game.description}</p>
      <p><strong>Genre:</strong> {game.genre}</p>
      <p><strong>Platform:</strong> {game.platform}</p>
      <p><strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}</p>
      <p><strong>Average Rating:</strong> {game.averageRating || 'No ratings yet'}</p>

      <form onSubmit={handleRatingSubmit} className="mt-4">
        <label className="block mb-2">
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
            className="ml-2 border border-gray-300 rounded p-1"
          />
        </label>
        <label className="block mb-2">
          Feedback:
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="ml-2 border border-gray-300 rounded p-1 w-full"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Submit Rating</button>
      </form>

      <h3 className="mt-6 text-xl font-semibold">Ratings and Feedback</h3>
      <ul>
        {/* Check if ratings exist and are an array before mapping */}
        {(Array.isArray(game.ratings) && game.ratings.length > 0) ? (
          game.ratings.map((rate, index) => (
            <li key={index} className="border-b py-2">
              <p><strong>Rating:</strong> {rate.rating}</p>
              <p><strong>Feedback:</strong> {rate.feedback}</p>
            </li>
          ))
        ) : (
          <li>No ratings yet.</li> // Fallback message if there are no ratings
        )}
      </ul>
    </div>
  );
};

export default GameDetails;