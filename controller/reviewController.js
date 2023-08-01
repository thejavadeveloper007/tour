const { default: mongoose } = require('mongoose');
const Review = require('../model/review');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { deleteOne, updateOne } = require('../controller/handlerFactory');

const createReview = catchAsync(async(req, res, next) =>{
    const { review, rating } = req.body;
    // console.log('tourid',req.params);
    const { tourId } = req.params;

    const userId = req.user;
    const createReview = await Review.create({review: review, rating: rating, tour: tourId, user: userId});
    res.status(200).json({
        status: "success",
        createReview
    })

});

const getReviewByTour = catchAsync(async(req, res, next) =>{
    let filter;
    if(req.params?.tourId) filter = { tour: req.params.tourId }
    if(req.params?.userId) filter = { tour: req.params.userId }
    const review = await Review.find(filter);
    res.status(200).json({
        status: "success",
        results: review.length,
        review
    });
});

const getReviewByUser = catchAsync(async(req, res, next) =>{
    const userId = req.user;
    const review = await Review.find({ user: userId });
    res.status(200).json({
        status: "success",
        results: review.length,
        review
    });
});

const deleteById = deleteOne(Review);

const updateById = updateOne(Review);

module.exports = { createReview, getReviewByTour, getReviewByUser, deleteById, updateById }