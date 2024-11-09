// routes/gameRoutes.mjs
import express from 'express';
import Game from '../models/game.mjs'; // Ensure Game.mjs exists in your models directory
import { verifyToken } from '../middleware/authToken.mjs'; // Middleware to verify JWT

const router = express.Router();

// Route to add a new game
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { title, description, genre, platform, releaseDate } = req.body;

    // Check if the game already exists
    const existingGame = await Game.findOne({ title });
    if (existingGame) {
      return res.status(400).json({ message: 'Game already exists' });
    }

    // Create and save the new game
    const newGame = new Game({ title, description, genre, platform, releaseDate });
    await newGame.save();

    res.status(201).json({ message: 'Game added successfully!', game: newGame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a rating to a game
router.post('/:gameId/rate', verifyToken, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const userId = req.user.userId; // Get user ID from the token

    // Find the game by ID
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if the user has already rated the game
    const existingRating = game.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this game' });
    }

    // Add the rating and update the average rating
    game.ratings.push({ userId, rating, feedback });
    game.calculateAverageRating();
    await game.save();

    res.status(201).json({ message: 'Rating added successfully', game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
