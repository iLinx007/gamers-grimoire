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
  cookie: { secure: false }
}));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT,  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  credentials: true          
}));


// Set up the routes
// app.use('/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/api/games', gameRoutes);  

app.use('/uploads', express.static('uploads'));

// Handle base route
app.get('/', (req, res) => {
  res.send('Gamer\'s Grimoire');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
