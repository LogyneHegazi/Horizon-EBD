const Review = require('../models/Review');

// POST /api/reviews  (needs a token)
// The logged-in student reviews the tutor of one of their sessions
const createReview = async (req, res) => {
  try {
    const { sessionRequest, tutor, rating, comment } = req.body;

    if (!sessionRequest || !tutor || !rating || !comment) {
      return res.status(400).json({ message: 'Session, tutor, rating and comment are required' });
    }

    if (tutor === req.user.id) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    // TODO: when the SessionRequest model is ready (use cases 3 and 4),
    // check that this session belongs to the student and its status is 'Completed'

    const existingReview = await Review.findOne({ sessionRequest });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this session' });
    }

    const review = await Review.create({
      sessionRequest,
      student: req.user.id,
      tutor,
      rating,
      comment
    });

    res.status(201).json({ review });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/mine  (needs a token)
// All the reviews the logged-in student has written
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ student: req.user.id })
      .populate('tutor', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/reviews/tutor/:tutorId
// All the reviews of one tutor, shown on their listing or profile
const getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutor: req.params.tutorId })
      .populate('student', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid tutor id' });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/reviews/:id  (needs a token)
// Only the student who wrote the review can edit it
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }

    const { rating, comment } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    res.status(200).json({ review });
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/reviews/:id  (needs a token)
// Only the student who wrote the review can delete it
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await review.deleteOne();

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid review id' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getMyReviews, getTutorReviews, updateReview, deleteReview };
