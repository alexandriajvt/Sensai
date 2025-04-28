const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// Endpoint to handle form submissions
router.post('/submit', contactController.submitInquiry);

// Endpoint to retrieve inquiries
router.get('/view', contactController.viewInquiries);

module.exports = router;
