const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the notification
  message: { type: String, required: true }, // The notification message
  read: { type: Boolean, default: false }, // Whether the notification is read
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', NotificationSchema);
