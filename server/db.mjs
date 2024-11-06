// import mongoose from 'mongoose';

// // User Schema
// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   hash: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   lists: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'List', // Reference to List model
//   }],
// });

// // Game Item Schema
// const gameItemSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   genre: {
//     type: String,
//     required: true,
//   },
//   releaseDate: {
//     type: Date,
//     required: true,
//   },
//   platform: {
//     type: [String], // Array of strings for platforms
//     required: true,
//   },
//   rating: {
//     type: Number, // Numeric rating
//     default: null, // Can be null if not rated yet
//   },
//   feedback: {
//     type: String, // User feedback
//     default: '', // Default empty string if no feedback given
//   },
//   checked: {
//     type: Boolean,
//     default: false, // Default value for whether the game is checked
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // List Schema
// const listSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to User model
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   items: [gameItemSchema], // Embedding game items
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Models
// const User = mongoose.model('User', userSchema);
// const List = mongoose.model('List', listSchema);

// // Exporting models
// export { User, List };
