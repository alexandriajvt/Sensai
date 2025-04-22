const express = require('express');
const router = express.Router();
const authController = require('../controllers/login.controller');

// Login endpoint (POST)
router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router;
