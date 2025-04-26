// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth.middleware');

// GET /api/users/:id - Retrieve user information
router.get('/:id', authenticateToken, userController.getUserInfo);

router.put('/:id', authenticateToken, userController.updateUser);
router.put('/:id/interests', authenticateToken, userController.updateUserInterests);  

module.exports = router;
