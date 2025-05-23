const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');


// Registration endpoint
router.post('/register', authController.register);

module.exports = router;
