import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();  // Initialize dotenv to use environment variables

const router = express.Router();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, password: hash });
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

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password); // Use async compare here

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    jwt.sign({ userId: user._id }, TOKEN_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        console.error('Error generating JWT:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: "Logged in successfully!" });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;