// routes/rsvp.routes.js
const express             = require('express');
const router              = express.Router();
const authenticateToken   = require('../middleware/auth.middleware');
const authorize           = require('../middleware/roleMiddleware');
const rsvpController      = require('../controllers/rsvp.controller');

// POST /api/rsvp → create a new RSVP (students, organizers & admins)
router.post(
  '/',
  authenticateToken,
  authorize(['student','organizer','admin']),
  rsvpController.createRsvp
);

router.get(
    '/user/:id',
    authenticateToken,
    authorize(['student','admin']),
    rsvpController.getUserRsvps
);
  
router.put(
    '/:id',
    authenticateToken,
    authorize(['student','admin']),
    rsvpController.updateRsvp
);

router.delete(
    '/:id',
    authenticateToken,
    authorize(['student','admin']),
    rsvpController.deleteRsvp
);
  
  
module.exports = router;
