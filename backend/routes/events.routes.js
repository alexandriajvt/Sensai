// routes/events.routes.js
const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const authenticateToken = require('../middleware/auth.middleware');
const authorize = require('../middleware/roleMiddleware');

// POST /api/events → create a new event
router.post(
  '/',
  authenticateToken,
  authorize(['organizer', 'admin']),
  eventsController.createEvent
);

module.exports = router;
