const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        // Optional: Validate user still exists in DB
        const result = await pool.query('SELECT * FROM logins WHERE user_id = $1 AND email = $2', [
            decoded.user_id,
            decoded.email
        ]);

        if (result.rows.length === 0) {
            return res.status(403).json({ message: 'Invalid token: user not found' });
        }

        // Attach user info to request
        req.user = {
            user_id: decoded.user_id,
            email: decoded.email
        };

        next(); // continue to route handler
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
