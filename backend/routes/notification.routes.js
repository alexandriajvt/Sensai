//notification.routes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

// Endpoint to send event notification
router.post('/alert',authenticateToken,notificationController.sendEventNotification);
// Handle notification toggle. 
router.post('/alert/preferences', notificationController.handleNotificationToggle);

module.exports = router;
