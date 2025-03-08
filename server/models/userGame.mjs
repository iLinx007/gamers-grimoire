import mongoose from 'mongoose';

const userGameSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  gameId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['not_started', 'completed', 'ongoing', 'aborted'],
    required: true,
    default: 'not_started'
  },
  startDate: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});

// Create a compound index to ensure a user can only have one status per game
userGameSchema.index({ userId: 1, gameId: 1 }, { unique: true });

// Update the lastUpdated timestamp when the status changes
userGameSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.lastUpdated = Date.now();
  }
  next();
});

export default mongoose.model('UserGame', userGameSchema); 