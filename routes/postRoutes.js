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
      authorName: req.user.username,
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
      const userIndex = post.likes.indexOf(user._id);
  
      if (userIndex !== -1) {
        // User has already liked the post; remove their like (unlike)
        post.likes.splice(userIndex, 1);
        await post.save();
        return res.json({ message: 'Post unliked successfully', liked: false, likes: post.likes });
      }
  
      // User has not liked the post; add their like
      post.likes.push(user._id);
      await post.save();
  
      res.json({ message: 'Post liked successfully', liked: true, likes: post.likes });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
    try {
      // Find the post by its ID
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      // Create a new comment
      const comment = new Comment({
        content: req.body.content,
        author: req.user._id, // Assuming user is authenticated
        post: post._id,
        authorName: req.user.username,
      });
  
      // Save the comment to the database
      await comment.save();
  
      // Add the comment to the post's comments array with the required fields
      post.comments.push({
        authorName: req.user.username,
        content: req.body.content || '',
        comment: comment._id, // Reference to the comment document
      });
  
      // Save the updated post
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

// Get all comments for a specific post
router.get('/:postId/comments', async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ message: 'Post not found' });
  
      // Populate the comments for the given post
      const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name email'); // Populate author details if needed
  
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

module.exports = router;
