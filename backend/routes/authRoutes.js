const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const authenticateToken = require('../middlewares/auth');
// Middleware to parse JSON (required in main app)
// app.use(express.json()); — Make sure this is in your main app.js/server.js

// POST /login
router.post('/login',async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM logins WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '2h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /signup
router.post('/signup',async (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if email already exists
        const existing = await pool.query('SELECT * FROM logins WHERE email = $1', [email]);

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        // Insert into users table
        const userResult = await pool.query(
            'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING user_id',
            [name, email, phone]
        );

        const user_id = userResult.rows[0].user_id;

        // Hash password and insert into logins table
        const password_hash = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO logins (user_id, email, password_hash) VALUES ($1, $2, $3)',
            [user_id, email, password_hash]
        );

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /verify-token
// POST /verify-token
router.post('/verify-token', authenticateToken, (req, res) => {
    // If authenticateToken middleware passes, the token is valid
    res.json({ valid: true });
});


module.exports = router;
