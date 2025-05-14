const express = require('express');
const router = express.Router();
const { estimatePrice, createBooking } = require('../controllers/rapidoController');

router.post('/estimate', estimatePrice);
router.post('/book', createBooking);

module.exports = router;