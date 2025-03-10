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
  cookie: { secure: false }
}));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT,  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  credentials: true          
}));


// Set up the routes
app.use('/api', authRoutes);
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
  res.send('Gamer\'s Grimoire');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
