const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    loginUserWithToken
} = require('../Controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/loginWithToken', loginUserWithToken);

module.exports = router;
