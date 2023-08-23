// import express from 'express';
const express = require("express");
// import createTour  from '../controller/tourController';
const { protect, restrictTo } = require("../controller/authController");
const {
  createTour,
  getAllTour,
  getTourById,
  deleteTourById,
  updateTourById,
  topTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getToursDistances,
} = require("../controller/tourController");
// const { createReview, getReviewByTour } = require('../controller/reviewController');
const reviewRouter = require("../routes/reviewRouter");
const { default: mongoose } = require("mongoose");

const tourRouter = express.Router();

tourRouter.param("id", (req, res, next, val) => {
  req.params.id = new mongoose.Types.ObjectId(val);
  next();
});
tourRouter.get(
  "/tours-within/:distance/center/:latlng/unit/:unit",
  getToursWithin,
);
tourRouter.get("/distances/:latlng/unit/:unit", getToursDistances);
tourRouter.use("/:tourId/reviews", reviewRouter);
tourRouter.get("/monthly-plan/:year", getMonthlyPlan);
tourRouter.get("/tour-stats", getTourStats);
tourRouter.get("/top-5-tours", topTour, getAllTour);
tourRouter
  .get("/",protect, getAllTour)
  .get("/:id", getTourById)
  .post("/", restrictTo("admin", "lead-guide", "guide"), createTour)
  .patch("/:id", updateTourById)
  .delete("/:id", protect, restrictTo("admin", "lead-guide"), deleteTourById);

module.exports = tourRouter;
