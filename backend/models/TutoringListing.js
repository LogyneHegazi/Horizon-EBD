const mongoose = require('mongoose');

const tutoringListingSchema = new mongoose.Schema({

    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    mode: {
        type: String,
        enum: ['Online', 'OnCampus'],
        required: true
    },

    availableSlots: [{
        startsAt: {
            type: Date,
            required: true
        },

        endsAt: {
            type: Date,
            required: true
        }
    }],

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model(
    'TutoringListing',
    tutoringListingSchema
);