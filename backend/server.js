
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const tutoringListingRoutes = require('./routes/tutoringListingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Tutoring listing routes
app.use('/api/listings', tutoringListingRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
};

startServer();
