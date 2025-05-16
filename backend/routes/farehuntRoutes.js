const express = require('express');
const router = express.Router();
const createBooking  = require('../controllers/farehuntController');
const authenticateToken = require('../middlewares/auth');


router.post('/book',authenticateToken, createBooking);

module.exports = router;