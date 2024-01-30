const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (_id, role) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id: _id, role: role }, jwtKey, { expiresIn: '1h' });
}


const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await userModel.findOne({ email });

        if (user) return res.status(400).json('User with given email already exists');

        if (!name || !email || !password)
            return res.status(400).json('All fields are required');

        if (!validator.isEmail(email))
            return res.status(400).json('Email must be a valid email...');

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json('Password must be a strong password...');
        }

        user = new userModel({ name, email, password, role });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id, user.role);

        res.header("x-auth-token", token);
        res.status(200).json({ _id: user._id, name, email, role, token, message: "Success signup" });

    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(500).json({ message: 'Invalid email or password' });
        }

        const token = createToken(user._id, user.role);

        res.cookie("accessToken", token);

        res.status(200).json({
            message: "Success login",
            _id: user._id, name: user.name, email, role: user.role, token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const loginUserGetData = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = createToken(user._id, user.role);
        res.cookie("accessToken", token);

        // Fetch checkout data
        const checkoutData = await Checkout.aggregate([
            {
                $unwind: '$products'
            },
            {
                $group: {
                    _id: '$products.product',
                    title: { $first: '$products.name' },
                    totalQuantity: { $sum: '$products.quantity' },
                    totalAmount: { $sum: '$products.price' },
                    startTime: { $min: '$createdAt' },
                    endTime: { $max: '$createdAt' }
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    totalQuantity: 1,
                    totalAmount: 1,
                    startTime: 1,
                    endTime: 1
                }
            },
            {
                $group: {
                    _id: null,
                    totalAllQuantity: { $sum: '$totalQuantity' },
                    totalAllAmount: { $sum: '$totalAmount' },
                    startTime: { $min: '$startTime' },
                    endTime: { $max: '$endTime' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalAllQuantity: 1,
                    totalAllAmount: 1,
                    startTime: 1,
                    endTime: 1
                }
            }
        ]);

        // Send the response with both user and checkout data
        res.status(200).json({
            message: "Success login",
            _id: user._id, name: user.name, email, role: user.role, token: token,
            checkoutData: { success: true, data: checkoutData }
        });

    } catch (error) {
        console.log(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const loginUserWithToken = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await userModel.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Success login with token',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        return res.status(401).json({ message: 'Invalid token' });
    }

    next();
};

module.exports = {
    registerUser,
    loginUser,
    loginUserWithToken,
    loginUserGetData
};