import express from 'express';
import { addGameToList, updateGameStatus, getUserGameList, removeGameFromList } from '../controllers/userGameController.mjs';
import { verifyToken } from '../middleware/authToken.mjs';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Add a game to user's list
router.post('/add', addGameToList);

// Update game status
router.put('/status', updateGameStatus);

// Get user's game list
router.get('/list/:userId', getUserGameList);

// Remove game from list
router.delete('/:userId/:gameId', removeGameFromList);

export default router; 