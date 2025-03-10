// models/Game.js
import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  genre: { type: [String], required: true },
  platform: { type: [String], required: true },
  releaseDate: { type: Date },
  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  image: {
    type: String,
    default: 'default-game-image.jpg'
  }
});

// Middleware to update the average rating whenever a new rating is added or updated
gameSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = parseFloat((total / this.ratings.length).toFixed(1));
  } else {
    this.averageRating = 0;
  }
};

export default mongoose.model('Game', gameSchema);
