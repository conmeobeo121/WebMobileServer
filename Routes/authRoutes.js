const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    loginUserWithToken,
    loginUserGetData
} = require('../Controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/loginWithToken', loginUserWithToken);
router.post('/loginGet', loginUserGetData);

module.exports = router;
