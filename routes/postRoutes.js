const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Create a new post
router.post('/create', postController.createNewPost);

// Get posts for the user's feed
router.get('/feed', postController.getPostFeed);

// Like a post
router.post('/:postId/like', postController.likeAPost);

// Add a comment to a post
router.post('/:postId/comment', postController.addCommentToPost);

// show all posts
router.post('/show-all', postController.showAllPosts)

// Get all comments for a specific post
router.get('/:postId/comments', postController.getCommentsForSpecificPost);

// Delete a post
router.delete('/:postId', postController.deleteAPost);

// get loggedin user posts
router.post('/my-posts', postController.getLoggedInUserPost);

// post of follewed users
router.post('/followed-posts', postController.getFollowedUsersPosts);

module.exports = router;
