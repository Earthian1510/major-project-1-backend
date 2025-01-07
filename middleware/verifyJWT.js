const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mySecret'; // Use the same secret as in your main file

// Middleware to verify JWT Token
const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.user = decodedToken;  // Attach the decoded token to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(402).json({ message: 'Invalid Token' });
    }
};

module.exports = verifyJWT;  // Export the middleware
