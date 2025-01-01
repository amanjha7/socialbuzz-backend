const express = require('express');
const Notification = require('../models/Notificationmodel');
const router = express.Router();

// Get notifications for the user
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Mark a notification as read
router.post('/mark-read/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
