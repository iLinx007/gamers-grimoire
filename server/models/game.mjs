// models/Game.js
import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  genre: { type: [String], required: true },
  platform: { type: [String], required: true },
  releaseDate: { type: Date },
  ratings: [ratingSchema], // Embed ratings directly into Game
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update the average rating whenever a new rating is added
gameSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = total / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
};

export default mongoose.model('Game', gameSchema);
