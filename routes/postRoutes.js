const express = require('express');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const User = require('../models/userModal');
const router = express.Router();

// Create a new post
router.post('/create', async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      author: req.user._id, // Assuming user is authenticated
    });

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get posts for the user's feed
router.get('/feed', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ created_at: -1 })
      .populate('author', 'username')
      .populate('likes', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Like a post
router.post('/:postId/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = req.user; // Assuming user is authenticated

    // Check if the user already liked the post
    if (post.likes.includes(user._id)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(user._id);
    await post.save();

    // Notify the user (You can add a notification system later)
    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      content: req.body.content,
      author: req.user._id, // Assuming user is authenticated
      post: post._id,
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/show-all', async (req,res)=>{
    try{
        // Example of handling posts in random order on the backend
        const posts = await Post.find();  // Get all posts from the database
        const shuffledPosts = posts.sort(() => Math.random() - 0.5); // Randomize order
        res.json(shuffledPosts);

    }catch(error){

    }
})

module.exports = router;
