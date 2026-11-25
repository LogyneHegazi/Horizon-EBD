const express = require('express');
const {
  createReview,
  getMyReviews,
  getTutorReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/mine', protect, getMyReviews);
router.get('/tutor/:tutorId', getTutorReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
