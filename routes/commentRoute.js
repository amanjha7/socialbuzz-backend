const router = require('express').Router();

const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const commentController = require('../controllers/commentController');

router.get('/:commentId', commentController.getComments );

router.delete('/comment/:commentId', commentController.deleteComment );