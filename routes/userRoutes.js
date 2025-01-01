const express = require('express');
const User = require('../models/userModal');
const router = express.Router();

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password') // Do not send password
      .populate('followers', 'username')
      .populate('following', 'username');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Follow a user
router.post('/follow/:id', async (req, res) => {
  try {
    const currentUser = req.user; // Assuming user is authenticated
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });

    // Add the user to the current user's following list
    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    // Add the current user to the followed user's followers list
    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Unfollow a user
router.post('/unfollow/:id', async (req, res) => {
  try {
    const currentUser = req.user; // Assuming user is authenticated
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) return res.status(404).json({ message: 'User not found' });

    // Remove the user from the current user's following list
    currentUser.following.pull(userToUnfollow._id);
    await currentUser.save();

    // Remove the current user from the followed user's followers list
    userToUnfollow.followers.pull(currentUser._id);
    await userToUnfollow.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get logged-in user's profile
router.get('/profile', async (req, res) => {
    try {
      const currentUser = req.user; // Assuming user is authenticated
  
      if (!currentUser) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Fetch user profile
      const user = await User.findById(currentUser._id)
        .select('-password') // Exclude password
        .populate('followers', 'username')
        .populate('following', 'username');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

module.exports = router;
