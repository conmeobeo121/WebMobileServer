const jwt = require('jsonwebtoken');

const decodeAccessToken = (accessToken) => {
    return jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
};

const checkRoleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: 'Access token not provided' });
        }

        try {
            const decodedToken = decodeAccessToken(accessToken);
            console.log('role', decodedToken.role);
            console.log('Decoded Token:', decodedToken);
            req.user = decodedToken;
            if (decodedToken.role === requiredRole) {
                req.user = decodedToken;
                next();
            } else {
                return res.status(403).json({ message: 'Permission denied: Invalid role' });
            }
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Invalid access token' });
        }
    };
};

module.exports = checkRoleMiddleware;
