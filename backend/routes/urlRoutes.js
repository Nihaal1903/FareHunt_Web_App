const express = require('express');
const router = express.Router();
const redirectUrl = require('../controllers/urlController');
const authenticateToken = require('../middlewares/auth');


router.post('/redirectionUrl',authenticateToken, redirectUrl);

module.exports = router;