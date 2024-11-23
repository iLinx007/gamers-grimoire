import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

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
// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming the token is stored in a cookie
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId; // Attach userId to the request object
    next();
  });
};

// Route to get the logged-in user's information
// router.get('/session', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId, 'username'); // Fetch only the username
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ loggedIn: true, username: user.username });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

router.get('/session', (req, res) => {
  const token = req.cookies.token; // Assuming you're using cookies to store the JWT
  if (!token) {
    return res.json({ loggedIn: false });
  }

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err); // Log JWT errors
      return res.json({ loggedIn: false });
    }
    
    try {
      const user = await User.findById(decoded.userId); // Fetch user by ID
      
      if (!user) {
        return res.json({ loggedIn: false });
      }
      
      res.json({
        loggedIn: true,
        user: {
          username: user.username,
          id: decoded.userId, // Ensure you convert to string if needed
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error); // Log error for debugging
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Login route
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
      
      // Set the token in a cookie
      res.cookie('token', token, { httpOnly: true });

      // Return user information along with success message
      res.json({
        message: "Logged in successfully!",
        user: {
          username: user.username,
          id: user._id.toString(), // Ensure ID is returned as a string
        },
      });
    });
  } catch (error) {
    console.error('Login error:', error); // Log error for debugging
    res.status(400).json({ error: error.message });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during logout' });
  }
});

export default router;