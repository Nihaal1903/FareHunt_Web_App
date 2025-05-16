const { Pool } = require('pg');

const pool = new Pool({
<<<<<<< HEAD
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ride_comparison',
    password: process.env.DB_PASSWORD || 'yourpassword',
=======
    user: process.env.DB_USER || 'naz',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ride_comparison',
    password: process.env.DB_PASSWORD || 'naz@123',
>>>>>>> f6b06ff (NajrudinAn modification and solve someProblems)
    port: process.env.DB_PORT || 5432,
});

module.exports = pool;