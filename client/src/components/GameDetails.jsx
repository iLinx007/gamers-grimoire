import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GameDetails = () => {
  const { gameId } = useParams(); // Get the game ID from the URL
  const [game, setGame] = useState(null); // To store game details
  const [rating, setRating] = useState(''); // To store the user rating input
  const [feedback, setFeedback] = useState(''); // To store feedback input
  const [error, setError] = useState(null); // To handle any error messages

  useEffect(() => {
    // Fetch game details when the component loads
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/games/${gameId}`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        setGame(response.data.game);
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
      const response = await axios.post(
        `http://localhost:8080/games/${gameId}/rate`,
        { rating, feedback },
        { withCredentials: true } // Send cookies with the request
      );
      setGame(response.data.game); // Update game details with the new rating
      setRating(''); // Clear input fields after submitting
      setFeedback('');
      setError(null);
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{game.title}</h2>
      <p>{game.description}</p>
      <p>Genre: {game.genre}</p>
      <p>Platform: {game.platform}</p>
      <p>Release Date: {new Date(game.releaseDate).toLocaleDateString()}</p>
      <p>Average Rating: {game.averageRating || 'No ratings yet'}</p>

      <form onSubmit={handleRatingSubmit}>
        <label>
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </label>
        <label>
          Feedback:
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </label>
        <button type="submit">Submit Rating</button>
      </form>

      <h3>Ratings and Feedback</h3>
      <ul>
        {game.ratings.map((rate, index) => (
          <li key={index}>
            <p>Rating: {rate.rating}</p>
            <p>Feedback: {rate.feedback}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameDetails;
