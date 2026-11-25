const TutoringListing = require('../models/TutoringListing');
// Validate tutoring listing information
const validateListing = (data) => {

    const { title, subject, description, mode, availableSlots } = data;

    // Check required text fields
    if (!title?.trim() || !subject?.trim() || !description?.trim()) {
        return 'Title, subject, and description are required.';
    }

    // Check session mode
    if (!['Online', 'OnCampus'].includes(mode)) {
        return 'Mode must be Online or OnCampus.';
    }

    // Check available slots
    if (!Array.isArray(availableSlots) || availableSlots.length === 0) {
        return 'At least one available time slot is required.';
    }

    // Check each time slot
    for (const slot of availableSlots) {

        if (!slot.startsAt || !slot.endsAt) {
            return 'Both start time and end time are required.';
        }

        const start = new Date(slot.startsAt);
        const end = new Date(slot.endsAt);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return 'Please enter valid dates.';
        }

        if (end <= start) {
            return 'End time must be later than start time.';
        }
    }

    return null;
};
// 1. Create a tutoring listing
const createListing = async (req, res) => {
    try {

        // Check listing information
        const validationError = validateListing(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        // Check authentication
        if (!req.user?.id) {
            return res.status(401).json({
                message: 'You must be logged in to create a listing.'
            });
        }

        const { title, subject, description, mode, availableSlots } = req.body;

        const listing = await TutoringListing.create({
            tutor: req.user.id,
            title: title.trim(),
            subject: subject.trim(),
            description: description.trim(),
            mode,
            availableSlots: availableSlots.map(slot => ({
                startsAt: new Date(slot.startsAt),
                endsAt: new Date(slot.endsAt)
            }))
        });

        res.status(201).json({
            message: 'Tutoring listing created successfully',
            listing
        });

    } catch (error) {
        console.error('Create listing error:', error);

        res.status(500).json({
            message: 'Server error while creating listing.'
        });
    }
};
// 2. Get all listings belonging to the logged-in tutor
const getMyListings = async (req, res) => {
    try {

        // Check authentication
        if (!req.user?.id) {
            return res.status(401).json({
                message: 'You must be logged in to view your listings.'
            });
        }

        const listings = await TutoringListing.find({
            tutor: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Your listings retrieved successfully',
            listings
        });

    } catch (error) {
        console.error('Get listings error:', error);

        res.status(500).json({
            message: 'Server error while retrieving listings.'
        });
    }
};


// 3. Update a tutoring listing
const updateListing = async (req, res) => {
    try {

        // Check listing information
        const validationError = validateListing(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        // Check authentication
        if (!req.user?.id) {
            return res.status(401).json({
                message: 'You must be logged in to update a listing.'
            });
        }

        const { title, subject, description, mode, availableSlots } = req.body;

        const listing = await TutoringListing.findOneAndUpdate(
            {
                _id: req.params.id,
                tutor: req.user.id
            },
            {
                title: title.trim(),
                subject: subject.trim(),
                description: description.trim(),
                mode,
                availableSlots: availableSlots.map(slot => ({
                    startsAt: new Date(slot.startsAt),
                    endsAt: new Date(slot.endsAt)
                }))
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found'
            });
        }

        res.status(200).json({
            message: 'Tutoring listing updated successfully',
            listing
        });

    } catch (error) {
        console.error('Update listing error:', error);

        res.status(500).json({
            message: 'Server error while updating listing.'
        });
    }
};

// 4. Deactivate a tutoring listing
const deactivateListing = async (req, res) => {
    try {

        // Check authentication
        if (!req.user?.id) {
            return res.status(401).json({
                message: 'You must be logged in to deactivate a listing.'
            });
        }

        const listing = await TutoringListing.findOneAndUpdate(
            {
                _id: req.params.id,
                tutor: req.user.id
            },
            {
                isActive: false
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found'
            });
        }

        res.status(200).json({
            message: 'Listing deactivated successfully',
            listing
        });

    } catch (error) {
        console.error('Deactivate listing error:', error);

        res.status(500).json({
            message: 'Server error while deactivating listing.'
        });
    }
};
// 5. Reactivate a tutoring listing
const reactivateListing = async (req, res) => {
    try {

        // Check authentication
        if (!req.user?.id) {
            return res.status(401).json({
                message: 'You must be logged in to reactivate a listing.'
            });
        }

        const listing = await TutoringListing.findOneAndUpdate(
            {
                _id: req.params.id,
                tutor: req.user.id
            },
            {
                isActive: true
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found'
            });
        }

        res.status(200).json({
            message: 'Listing reactivated successfully',
            listing
        });

    } catch (error) {
        console.error('Reactivate listing error:', error);

        res.status(500).json({
            message: 'Server error while reactivating listing.'
        });
    }
};


// 6. Delete a tutoring listing
const deleteListing = async (req, res) => {
    try {

        // Check authentication
        if (!req.user?.id) {
            return res.status(401).json({
                message: 'You must be logged in to delete a listing.'
            });
        }

        const listing = await TutoringListing.findOneAndDelete({
            _id: req.params.id,
            tutor: req.user.id
        });

        if (!listing) {
            return res.status(404).json({
                message: 'Listing not found'
            });
        }

        res.status(200).json({
            message: 'Tutoring listing deleted successfully'
        });

    } catch (error) {
        console.error('Delete listing error:', error);

        res.status(500).json({
            message: 'Server error while deleting listing.'
        });
    }
};


module.exports = {
    createListing,
    getMyListings,
    updateListing,
    deactivateListing,
    reactivateListing,
    deleteListing
};