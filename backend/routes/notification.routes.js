//notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

// Endpoint to send event notification
router.post('/alert', notificationController.sendEventNotification);
// Handle notification toggle. 
router.post('/alert/preferences', notificationController.handleNotificationToggle);

module.exports = router;
