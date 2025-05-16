const express = require('express');
const router = express.Router();
const { estimatePrice, createBooking } = require('../controllers/uberController');
<<<<<<< HEAD

router.post('/estimate', estimatePrice);
router.post('/book', createBooking);
=======
const authenticateToken = require('../middlewares/auth');

router.post('/estimate',authenticateToken, estimatePrice);
router.post('/book',authenticateToken, createBooking);
>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)

module.exports = router;