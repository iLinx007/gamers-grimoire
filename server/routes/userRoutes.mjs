import express from 'express';
import User from '../models/user.mjs';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../middleware/authToken.mjs';

const router = express.Router();

// Update user profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    
    // Check if username is taken
    const existingUser = await User.findOne({ username, _id: { $ne: req.params.id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Update password
router.put('/:id/password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});

// Delete account
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's games and other related data here
    // You might want to add more cleanup logic depending on your data structure

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
});

export default router; 