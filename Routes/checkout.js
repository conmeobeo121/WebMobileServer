const express = require('express');
const router = express.Router();
const { getCheckOut } = require('../Controllers/checkoutController');

router.post('/', getCheckOut);

module.exports = router;
