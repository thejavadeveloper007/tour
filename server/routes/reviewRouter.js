const express = require('express');
const { protect, restrictTo } = require('../controller/authController');
const { createReview, getReviewByTour, getReviewByUser, deleteById, updateById } = require('../controller/reviewController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter 
.post('/', protect, restrictTo('user'), createReview)
    .get('/', protect, getReviewByTour);

reviewRouter.delete('/:id', protect, restrictTo('admin'), deleteById);
reviewRouter.patch('/:id', protect, updateById);

module.exports = reviewRouter