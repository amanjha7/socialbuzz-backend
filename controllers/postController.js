const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const createNewPost = async (req, res) => {
    try {

        // if req.hashtags is string convert to array by , or space
        if (typeof req.body.hashtags === 'string') {
            req.body.hashtags = req.body.hashtags.split(',').map((tag) => tag.trim());
        }

        const { content, hashtags, image_url } = req.body;

        const post = new Post({
            content,
            hashtags,
            image_url,
            author: req.user._id,  // Assuming user is authenticated
            authorName: req.user.username
        });

        await post.save();

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.error('Error creating post', error);
        res.status(500).json({ message: 'Error creating post', error });
    }
}


const getPostFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ created_at: -1 })
            .populate('author', 'username')
            .populate('likes', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


const likeAPost = async (req, res) => {
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
}

const addCommentToPost = async (req, res) => {
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
}

const showAllPosts = async (req, res) => {
    try {
        // Example of handling posts in random order on the backend
        const posts = await Post.find();  // Get all posts from the database
        const shuffledPosts = posts.sort(() => Math.random() - 0.5); // Randomize order
        res.json(shuffledPosts);

    } catch (error) {

    }
}

const getCommentsForSpecificPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Populate the comments for the given post
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name email'); // Populate author details if needed

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const deleteAPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        await post.remove();

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const getLoggedInUserPost = async (req, res) => {
    try {
        const user = req.user; // Assuming user is authenticated
        const posts = await Post.find({ author: user._id });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const getFollowedUsersPosts = async (req, res) => {
    try {
        const user = req.user; // Assuming user is authenticated
        const posts = await Post.find({ author: { $in: user.following } });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = { createNewPost, getPostFeed, likeAPost, addCommentToPost, showAllPosts, getCommentsForSpecificPost, deleteAPost, getLoggedInUserPost, getFollowedUsersPosts }