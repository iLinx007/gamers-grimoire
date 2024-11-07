// routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.mjs';

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user with the hashed password
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Store the user's ID in the session to keep track of logged-in users
    req.session.userId = user._id;
    res.json({ message: 'Logged in successfully!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ error: 'Failed to log out' });
    }
    res.json({ message: 'Logged out successfully!' });
  });
});


export default router;
