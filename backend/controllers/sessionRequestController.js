const SessionRequest = require('../models/SessionRequest');
const TutoringListing = require('../models/TutoringListing');

// 1. Get all available tutoring listings
const getAvailableListings = async (req, res) => {
    try {
        const listings = await TutoringListing.find({
            isActive: true
        })
        .populate('tutor', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Available tutoring listings retrieved successfully',
            listings
        });

    } catch (error) {
        console.error('Get available listings error:', error);

        res.status(500).json({
            message: 'Server error while retrieving tutoring listings.'
        });
    }
};

// 2. Request a tutoring session
const createSessionRequest = async (req, res) => {
    try {
        const { listingId, slotId, message } = req.body;

        // Check required information
        if (!listingId || !slotId) {
            return res.status(400).json({
                message: 'Listing ID and time slot ID are required.'
            });
        }

        // Find the selected tutoring listing
        const listing = await TutoringListing.findOne({
            _id: listingId,
            isActive: true
        });

        if (!listing) {
            return res.status(404).json({
                message: 'Tutoring listing not found or inactive.'
            });
        }

        // Prevent students from booking their own listings
        if (listing.tutor.toString() === req.user.id) {
            return res.status(400).json({
                message: 'You cannot request your own tutoring session.'
            });
        }

        // Find the selected available time slot
        const selectedSlot = listing.availableSlots.id(slotId);

        if (!selectedSlot) {
            return res.status(404).json({
                message: 'Selected time slot not found.'
            });
        }

        // Check whether the slot is already booked
        const existingRequest = await SessionRequest.findOne({
            listing: listingId,
            slotId: slotId,
            status: { $in: ['Pending', 'Accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({
                message: 'This time slot has already been requested.'
            });
        }

        // Create the session request
        const sessionRequest = await SessionRequest.create({
            listing: listingId,
            student: req.user.id,
            slotId: slotId,
            scheduledAt: selectedSlot.startsAt,
            message: message?.trim() || ''
        });

        res.status(201).json({
            message: 'Tutoring session requested successfully!',
            sessionRequest
        });

    } catch (error) {
        console.error('Create session request error:', error);

        res.status(500).json({
            message: 'Server error while creating session request.'
        });
    }
};

// 3. Get the logged-in student's session requests
const getMySessions = async (req, res) => {
    try {
        const sessions = await SessionRequest.find({
            student: req.user.id
        })
        .populate({
            path: 'listing',
            select: 'title subject description mode tutor',
            populate: {
                path: 'tutor',
                select: 'name email'
            }
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Your session requests retrieved successfully',
            sessions
        });

    } catch (error) {
        console.error('Get my sessions error:', error);

        res.status(500).json({
            message: 'Server error while retrieving your sessions.'
        });
    }
}; 
module.exports = {
    getAvailableListings,
    createSessionRequest,
    getMySessions
};
