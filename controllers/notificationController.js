const Notification = require('../models/Notificationmodel');

const getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

module.exports = { getNotification, markNotificationRead }