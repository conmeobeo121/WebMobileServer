const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    console.log('All Cookies:', req.cookies);

    const accessToken = req.cookies.accessToken;

    console.log('Access Token:', accessToken);
    if (!accessToken) {
        return res.status(401).json({ message: 'Access token not provided' });
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

        req.user = decodedToken;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid access token' });
    }
};


module.exports = verifyToken;
