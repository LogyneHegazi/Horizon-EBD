const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');

const {
    getAvailableListings,
    createSessionRequest,
    getMySessions
} = require('../controllers/sessionRequestController');

// Browse all available tutoring listings
router.get('/listings', protect, getAvailableListings);

// Request a tutoring session
router.post('/', protect, createSessionRequest);

// View the logged-in student's sessions
router.get('/my-sessions', protect, getMySessions);

module.exports = router;

