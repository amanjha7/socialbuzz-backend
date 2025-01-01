const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Text content of the post
  image_url: String, // Optional image for the post
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the post
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users who liked the post
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Array of comment references
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
