const router = require('express').Router();

const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

// get a comment
router.get('/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId).populate('post').populate('author');
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})