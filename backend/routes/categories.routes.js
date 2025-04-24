// routes/categories.routes.js
const express = require('express');
const router  = express.Router();
const ctl = require('../controllers/categories.controller');

router.get('/',              ctl.listCategories);         // GET /api/categories
router.get('/:id/interests', ctl.listInterestsByCategory); // GET /api/categories/:id/interests

module.exports = router;
