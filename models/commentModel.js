const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Content of the comment
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Author of the comment
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Post to which the comment belongs
  created_at: { type: Date, default: Date.now },
  authorName: {type: String, required: false}, // Name of the author
});

module.exports = mongoose.model('Comment', CommentSchema);
