const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const authenticateUser = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');
const { getCheckOut } = require('../Controllers/checkoutController');

const {
    getAllProducts,
    getOneProduct,
} = require('../Controllers/productControllers');

router.get('/profile', authenticateUser, checkRoleMiddleware('customer'), (req, res) => {
    try {
        var checkTokenValid = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET_KEY);

        userModel.findById({ _id: checkTokenValid._id })
            .then((response) => {
                return res.json({
                    message: 'access token customer',
                    _id: response._id,
                    name: response.name,
                    email: response.email,
                    role: response.role,
                });
            }).catch((error) => {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', getCheckOut);

router.get('/products', getAllProducts);

router.get('/products/:productId', getOneProduct);

module.exports = router;