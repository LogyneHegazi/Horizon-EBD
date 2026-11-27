
const mongoose = require('mongoose');

const sessionRequestSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TutoringListing',
    required: true
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  scheduledAt: {
    type: Date,
    required: true
  },

  message: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'],
    default: 'Pending'
  }

}, { timestamps: true });

module.exports = mongoose.model('SessionRequest', sessionRequestSchema);

