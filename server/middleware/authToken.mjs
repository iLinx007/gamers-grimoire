// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded; // Attach user info from token to request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
