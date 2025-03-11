import './config/config.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.mjs';
import dotenv from 'dotenv';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import gameRoutes from './routes/gameRoutes.mjs';
import userGameRoutes from './routes/userGameRoutes.mjs';
import userRoutes from './routes/userRoutes.mjs';

// time to fix the upload feature and add extra functionality


const __filename = fileURLToPath(import.meta.url); // Get the current file's path
const __dirname = path.dirname(__filename);   

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect(process.env.DSN);

// Middleware setup
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: 'lax'
  }
}));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set up the routes
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/user-games', userGameRoutes);

// app.use('/auth', authRoutes);
// Logging middleware
// app.use((req, _, next) => {
//   console.log(req.path.toUpperCase(), req.body);
//   next();
//  });
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle base route
app.get('/', (req, res) => {
  res.send('Gamer\'s Grimoire API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on:`);
  console.log(`- Local: http://localhost:${port}`);
  console.log(`- Network: http://0.0.0.0:${port}`);
});
