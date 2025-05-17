const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middlewares/auth');
const profile = require('../controllers/userController');

// GET /user/profile
router.get('/profile', authenticateToken, profile );

module.exports = router;
