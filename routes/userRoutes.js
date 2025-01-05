const express = require('express');
const User = require('../models/userModal');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// Get user profile
router.get('/profile/:id', userController.getUserProfile);

// Follow a user
router.post('/follow/:id', userController.followAUser);

// Unfollow a user
router.post('/unfollow/:id', userController.unfollowAUser);

// Get logged-in user's profile
router.get('/profile', userController.getLoggedInUserProfile);

// Update User Profile (only admin can update role)
router.put('/profile', userController.updateUserProfile);

// list followers
router.post('/followers', userController.listFollowers);

// list follwing
router.post('/following', userController.listFollowing);

module.exports = router;
