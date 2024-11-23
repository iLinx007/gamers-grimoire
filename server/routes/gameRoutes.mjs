// routes/gameRoutes.mjs
import express from 'express';
import Game from '../models/game.mjs'; // Ensure Game.mjs exists in your models directory
import User from '../models/user.mjs'; // Adjust the path as necessary
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

router.get('/all', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error: error.message });
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

// Get user by ID
router.get('/user/:id', verifyToken, async (req, res) => {
  try {
    // Fetch user by ID and exclude the password field from the response
    const user = await User.findById(req.params.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.json({
      id: user._id.toString(), // Convert to string if needed
      username: user.username,
      gamesList: user.gamesList, // Include gamesList if needed
      // Add any other fields you want to return
    });
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

export default router;
