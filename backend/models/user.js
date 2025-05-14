const pool = require('../config/db');

class User {
    static async create(userData) {
        const { name, email, phone } = userData;
        const result = await pool.query(
            'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
            [name, email, phone]
        );
        return result.rows[0];
    }

    static async findById(userId) {
        const result = await pool.query(
            'SELECT * FROM users WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    static async update(userId, updateData) {
        const { name, phone } = updateData;
        const result = await pool.query(
            'UPDATE users SET name = $1, phone = $2 WHERE user_id = $3 RETURNING *',
            [name, phone, userId]
        );
        return result.rows[0];
    }
}

module.exports = User;