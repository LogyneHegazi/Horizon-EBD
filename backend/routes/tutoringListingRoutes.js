const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');

const {
    createListing,
    getMyListings,
    updateListing,
    deactivateListing,
    reactivateListing,
    deleteListing
} = require('../controllers/tutoringListingController');

// Create a tutoring listing
router.post('/', protect, createListing);

// Get the logged-in tutor's listings
router.get('/my-listings', protect, getMyListings);

// Update a tutoring listing
router.put('/:id', protect, updateListing);

// Deactivate a tutoring listing
router.patch('/:id/deactivate', protect, deactivateListing);

// Reactivate a tutoring listing
router.patch('/:id/reactivate', protect, reactivateListing);

// Delete a tutoring listing
router.delete('/:id', protect, deleteListing);

module.exports = router;