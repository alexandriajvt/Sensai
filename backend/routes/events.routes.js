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
  eventsController.createEvent,
);

router.put(
    '/:id',
    authenticateToken,
    authorize(['organizer','admin']),
    eventsController.updateEvent
);

router.get(
    '/:id',
    authenticateToken,
    eventsController.getEventDetails
  );
  
router.get(
    '/matched',
    authenticateToken,
    eventsController.getMatchedEvents
);

router.delete(
    '/:id',
    authenticateToken,
    authorize(['organizer','admin']),
    eventsController.deleteEvent
);
  
router.put(
    '/:id/approve',
    authenticateToken,
    authorize(['admin']),
    eventsController.approveEvent
  );
  router.put(
    '/:id/reject',
    authenticateToken,
    authorize(['admin']),
    eventsController.rejectEvent
  );

module.exports = router;
