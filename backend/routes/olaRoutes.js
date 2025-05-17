const express = require('express');
const router = express.Router();
const { estimatePrice, createBooking } = require('../controllers/olaController');
const authenticateToken = require('../middlewares/auth');

router.post('/estimate',authenticateToken, estimatePrice);
router.post('/book',authenticateToken, createBooking);

module.exports = router;