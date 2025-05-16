require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
const uberRoutes = require('./routes/uberRoutes');
const olaRoutes = require('./routes/olaRoutes');
const rapidoRoutes = require('./routes/rapidoRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const urlRoutes = require('./routes/urlRoutes');
const fareRoutes = require('./routes/farehuntRoutes');


app.use('/api/uber', uberRoutes);
app.use('/api/ola', olaRoutes);
app.use('/api/rapido', rapidoRoutes);
app.use('/api', bookingRoutes);
app.use('/api', urlRoutes);
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/farehunt', fareRoutes);


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});