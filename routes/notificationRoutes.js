const express = require('express');
const Notification = require('../models/Notificationmodel');
const router = express.Router();
const notificationController = require('../controllers/notificationController')

// Get notifications for the user
router.get('/', notificationController.getNotification);

// Mark a notification as read
router.post('/mark-read/:id', notificationController.markNotificationRead);

module.exports = router;
