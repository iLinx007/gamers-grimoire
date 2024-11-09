import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mongoose from 'mongoose';
import User from './models/user.mjs';
import authRoutes from './routes/auth.mjs';
import dotenv from 'dotenv';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import gameRoutes from './routes/gameRoutes.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect(process.env.MONGO);
console.log('Connected to MongoDB');

// Middleware setup
app.use(express.json()); // Body parser for JSON data
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  credentials: true          
}));


// Set up the routes
app.use('/auth', authRoutes); // Route for authentication
app.use('/api', authRoutes);
app.use('/api/games', gameRoutes);  

// Handle base route
app.get('/', (req, res) => {
  res.send('Gamer\'s Grimoire');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
