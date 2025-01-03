const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Text content of the post
  image_url: String, // Optional image for the post
  authorName: {type: String, required: true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the post
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users who liked the post
  comments: [{
    authorName: { type: String, required: false }, // Name of the author of the comment
    content: { type: String, required: false }, // Content of the comment
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Reference to the original Comment
  }], // Array of comment references
  hashtags: { type: [String], required: false }, // Hashtag associated with the post
  image_url: { type: String, required: false }, // Image URL
  created_at: { type: Date, default: Date.now },
});

PostSchema.pre('validate',()=>{
  // if hastag is string type convert to array
  if (typeof this.hashtags === 'string') {
    this.hashtags = this.hashtags.split(',').map((tag) => tag.trim());
  }
})

module.exports = mongoose.model('Post', PostSchema);
