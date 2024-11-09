import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const GameDetails = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await api.get(`/games/${gameId}`);
        setGame(response.data.game);
      } catch (error) {
        setError('Failed to load game details');
      }
    };
    fetchGameDetails();
  }, [gameId]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post(`/games/${gameId}/rate`, { rating, feedback });
      setSuccess('Rating added successfully!');
      setFeedback('');
      setRating(0);
      const response = await api.get(`/games/${gameId}`);
      setGame(response.data.game);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit rating');
    }
  };

  if (!game) return <p>Loading game details...</p>;

  return (
    <div>
      <h2>{game.title}</h2>
      <p><strong>Description:</strong> {game.description}</p>
      <p><strong>Genre:</strong> {game.genre}</p>
      <p><strong>Platform:</strong> {game.platform}</p>
      <p><strong>Release Date:</strong> {game.releaseDate}</p>
      <p><strong>Average Rating:</strong> {game.averageRating || 'Not rated yet'}</p>

      <h3>Ratings & Feedback</h3>
      {game.ratings.length > 0 ? (
        <ul>
          {game.ratings.map((rate, index) => (
            <li key={index}>
              <p><strong>User:</strong> {rate.userId}</p>
              <p><strong>Rating:</strong> {rate.rating}</p>
              <p><strong>Feedback:</strong> {rate.feedback}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No ratings yet. Be the first to rate!</p>
      )}

      <h3>Submit Your Rating</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleRatingSubmit}>
        <label>
          Rating (1-5):
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
            required
          />
        </label>
        <button type="submit">Submit Rating</button>
      </form>
    </div>
  );
};

export default GameDetails;
