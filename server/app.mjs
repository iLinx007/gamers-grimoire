import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mongoose from 'mongoose';
import User from './models/user.mjs';
import authRoutes from './routes/auth.mjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
console.log('Connected to MongoDB');
console.log(process.env.MONGO);
mongoose.connect(process.env.MONGO);
console.log('Connected to MongoDB');

// Middleware setup
app.use(express.json()); // Body parser for JSON data
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false 
}));

// Set up the routes
app.use('/auth', authRoutes); // Route for authentication
app.use('/api', authRoutes); 

// Handle base route
app.get('/', (req, res) => {
  res.send('Gamer\'s Grimoire');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
