// routes/gameRoutes.mjs
import express from 'express';
import Game from '../models/game.mjs'; // Ensure Game.mjs exists in your models directory
import User from '../models/user.mjs'; // Adjust the path as necessary
import { verifyToken } from '../middleware/authToken.mjs'; // Middleware to verify JWT
import upload from '../middleware/uploadMiddleware.mjs';

const router = express.Router();


router.post('/add', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, genre, platform, addedDate, image } = req.body;
    // const image = req.file ? req.file.path : null;

    // Validate required fields
    if (!title || !description || !genre || !platform || !addedDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the game already exists
    const existingGame = await Game.findOne({ title });
    if (existingGame) {
      return res.status(400).json({ message: 'Game already exists' });
    }

    // Create and save the new game
    const newGame = new Game({ title, description, genre, platform, addedDate, image });
    await newGame.save();

    res.status(201).json({
      message: 'Game added successfully!',
      game: newGame,
      gameId: newGame._id
    });
  } catch (error) {
    console.error('Error adding game:', error);
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

router.get('/search', async (req, res) => {
  try {
    const { term } = req.query;
    const games = await Game.find({
      $or: [
        { title: { $regex: term, $options: 'i' } },
        { platform: { $regex: term, $options: 'i' } },
        { genre: { $regex: term, $options: 'i' } }
      ]
    });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error: error.message });
  }
});



// Route to add a rating to a game
// router.post('user/:gameId/rate', verifyToken, async (req, res) => {
//   console.log(req);
//   try {
//     const { rating, feedback } = req.body;
//     const userId = req.user.userId; // Get user ID from the token
    

//     // Find the game by ID
//     const game = await Game.findById(req.params.gameId);
//     if (!game) {
//       return res.status(404).json({ message: 'Game not found' });
//     }

//     // Check if the user has already rated the game
//     const existingRating = game.ratings.find(r => r.userId.toString() === userId);
//     if (existingRating) {
//       return res.status(400).json({ message: 'You have already rated this game' });
//     }

//     // Add the rating and update the average rating
//     game.ratings.push({ userId, rating, feedback });
//     game.calculateAverageRating();
//     await game.save();

//     res.status(201).json({ message: 'Rating added successfully', game });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/user/:gameId/rate', verifyToken, async (req, res) => {
  const { gameId } = req.params;
  const { rating } = req.body;
  const userId = req.user.userId;

  try {
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating. Must be between 1 and 5.' });
    }

    // Find the game and update its ratings
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Add the new rating to the game's ratings array
    game.ratings.push({ userId, rating });
    game.calculateAverageRating();
    await game.save();

    res.status(200).json({ message: 'Game rated successfully' });
  } catch (error) {
    console.error('Error rating game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/user/:gameId/delete', verifyToken, async (req, res) => {
  const { gameId } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialLength = user.gamesList.length;
    user.gamesList = user.gamesList.filter(id => id.toString() !== gameId);

    if (initialLength === user.gamesList.length) {
      return res.status(404).json({ message: 'Game not found in user\'s list' });
    }

    await user.save();
    res.status(200).json({ message: 'Game removed successfully', gamesList: user.gamesList });
  } catch (error) {
    console.error('Error removing game:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// router.post('/user/:gameId/complete', verifyToken, async (req, res) => {

// });



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
      gamesList: user.gamesList,
      // Add any other fields you want to return
    });
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

router.post('/users/:id/add-game', verifyToken, async (req, res) => {
  const { gameId } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize gamesList if it doesn't exist
    if (!user.gamesList) {
      user.gamesList = [];
    }

    if (!user.gamesList.includes(gameId)) {
      user.gamesList.push(gameId);
      await user.save();
      return res.status(200).json({ message: 'Game added successfully!' });
    } else {
      return res.status(400).json({ message: 'Game already in your list.' });
    }
  } catch (error) {
    console.error('Error adding game to user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;







// Route to add a new game
// router.post('/add', verifyToken, async (req, res) => {
//   try {
//     const { title, description, genre, platform, addedDate, image } = req.body;

//     // Check if the game already exists
//     const existingGame = await Game.findOne({ title });
//     if (existingGame) {
//       return res.status(400).json({ message: 'Game already exists' });
//     }

//     // Create and save the new game
//     const newGame = new Game({ title, description, genre, platform, addedDate, image });
//     await newGame.save();

//     res.status(201).json({ message: 'Game added successfully!', game: newGame });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// router.post('/add', verifyToken, async (req, res) => {
//   try {
//     const { title, description, genre, platform, addedDate, image } = req.body;

//     // Validate required fields
//     if (!title || !description || !genre || !platform || !addedDate) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Check if the game already exists
//     const existingGame = await Game.findOne({ title });
//     if (existingGame) {
//       return res.status(400).json({ message: 'Game already exists' });
//     }

//     // Create and save the new game
//     const newGame = new Game({ title, description, genre, platform, addedDate, image });
//     await newGame.save();

//     res.status(201).json({ message: 'Game added successfully!', game: newGame });
//   } catch (error) {
//     console.error('Error adding game:', error);
//     res.status(500).json({ error: error.message });
//   }
// });


// router.post('/users/:id/add-game', verifyToken, async (req, res) => {
//   const { gameId } = req.body; // Get the game ID from the request body

//   try {
//     // Find user by ID and update their gamesList
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Add the gameId to the user's gamesList if it's not already present
//     if (!user.gamesList.includes(gameId)) {
//       user.gamesList.push(gameId);
//       await user.save();
//       return res.status(200).json({ message: 'Game added successfully!' });
//     } else {
//       return res.status(400).json({ message: 'Game already in your list.' });
//     }
//   } catch (error) {
//     console.error('Error adding game to user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.post('/users/:id/add-game', verifyToken, async (req, res) => {
//   const { gameId } = req.body;

//   // Check if user is authenticated
//   if (!req.user) {
//     return res.status(401).json({ message: 'User not authenticated' });
//   }

//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.gamesList.includes(gameId)) {
//       user.gamesList.push(gameId);
//       await user.save();
//       return res.status(200).json({ message: 'Game added successfully!' });
//     } else {
//       return res.status(400).json({ message: 'Game already in your list.' });
//     }
//   } catch (error) {
//     console.error('Error adding game to user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });