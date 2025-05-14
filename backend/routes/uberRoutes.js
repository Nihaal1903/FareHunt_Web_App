const express = require('express');
const router = express.Router();
const { estimatePrice, createBooking } = require('../controllers/uberController');

router.post('/estimate', estimatePrice);
router.post('/book', createBooking);

module.exports = router;