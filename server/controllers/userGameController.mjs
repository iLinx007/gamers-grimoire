import UserGame from '../models/userGame.mjs';
import Game from '../models/game.mjs';
import mongoose from 'mongoose';

// Add a game to user's list
export const addGameToList = async (req, res) => {
  try {
    const { userId, gameId } = req.body;

    // Validate input
    if (!userId || !gameId) {
      return res.status(400).json({ message: 'Both userId and gameId are required' });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid userId or gameId format' });
    }

    // Check if the game exists
    const gameExists = await Game.findById(gameId);
    if (!gameExists) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if the game is already in user's list
    const existingUserGame = await UserGame.findOne({ userId, gameId });
    if (existingUserGame) {
      return res.status(400).json({ message: 'Game already in user\'s list' });
    }

    // Create new user-game relationship
    const userGame = new UserGame({
      userId,
      gameId,
      status: 'not_started'
    });

    await userGame.save();
    
    // Return the populated game data
    const populatedUserGame = await UserGame.findById(userGame._id).populate('gameId');
    res.status(201).json(populatedUserGame);
  } catch (error) {
    console.error('Error adding game to list:', error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Game already in user\'s list' });
    }
    res.status(500).json({ message: 'Failed to add game to list' });
  }
};

// Update game status
export const updateGameStatus = async (req, res) => {
  try {
    const { userId, gameId, status } = req.body;
    
    const userGame = await UserGame.findOneAndUpdate(
      { userId, gameId },
      { status },
      { new: true, runValidators: true }
    );

    if (!userGame) {
      return res.status(404).json({ message: 'Game not found in user\'s list' });
    }

    res.json(userGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's game list with statuses
export const getUserGameList = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Ensure userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Get user games with populated game data
    const userGames = await UserGame.find({ userId })
      .populate({
        path: 'gameId',
        select: '_id title genre platform description image averageRating' // Select only needed fields
      })
      .sort({ lastUpdated: -1 });

    // Transform the data to ensure consistent structure
    const formattedUserGames = userGames.map(userGame => ({
      _id: userGame._id,
      userId: userGame.userId,
      gameId: userGame.gameId,
      status: userGame.status,
      startDate: userGame.startDate,
      lastUpdated: userGame.lastUpdated
    }));

    res.json(formattedUserGames);
  } catch (error) {
    console.error('Error fetching user game list:', error);
    res.status(500).json({ message: 'Failed to fetch user game list' });
  }
};

// Remove game from user's list
export const removeGameFromList = async (req, res) => {
  try {
    const { userId, gameId } = req.params;
    
    const userGame = await UserGame.findOneAndDelete({ userId, gameId });
    
    if (!userGame) {
      return res.status(404).json({ message: 'Game not found in user\'s list' });
    }

    res.json({ message: 'Game removed from list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 