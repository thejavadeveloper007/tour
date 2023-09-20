// import Tour from './../model/tour';
const { default: mongoose } = require("mongoose");
const Tour = require("../model/tour");
const { json } = require("body-parser");
const APIFeature = require("../utils/apiFeatures");
const { pipeline } = require("nodemailer/lib/xoauth2");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const redis = require('./redisSetup');
const util = require('util');
// const { redisClient } = require('../server');
const {
  deleteOne,
  updateOne,
  getOne,
} = require("../controller/handlerFactory");

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const pipeline = [
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-02-01`),
          $lte: new Date(`${year}-09-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        totalTours: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { totalTours: -1 },
    },
  ];
  const monthlyPlan = await Tour.aggregate(pipeline);
  res.status(200).json({
    status: "success",
    results: monthlyPlan.length,
    data: monthlyPlan,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        ratingAvg: { $gte: 4 },
      },
    },
    {
      $group: {
        _id: "$ratingAvg",
        totalTours: { $sum: 1 },
        avgRating: { $avg: "$ratingAvg" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $match: { _id: { $ne: 4.2 } },
    },
  ];
  const stats = await Tour.aggregate(pipeline);
  res.status(200).json({
    status: "success",
    data: stats,
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const reqBody = req.body;
  const tourData = await Tour.create(reqBody);

  console.log("res", tourData);
  res.status(200).json({
    status: "success",
    message: "Tour created successfully",
    data: tourData,
  });
});

const topTour = (req, res, next) => {
  console.log("--------");
  req.query.limit = "5";
  req.query.sort = "-ratingAvg,price";
  req.query.fields = "name,cityName,ratingAvg,price";
  next();
};

const getAllTour = catchAsync(async (req, res, next) => {
  // const redisClient = redis.createClient();
  // console.log('redis client',redisClient);
  // await redisClient.connect();
  // redisClient.set = util.promisify(redisClient.set);
  // //build query
  // const queryObj = {...req.query};
  // console.log('30',queryObj);
  //1.filtering
  // const excludedfields = ['page','price','description'];
  // excludedfields.forEach(el => delete queryObj[el]);
  // let queryStr = JSON.stringify(queryObj);
  //  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); //we need to put $ sign in front of each query bcz in endpoint we can't use.
  // let query = Tour.find(); //if you want to apply some extra soting and fltering then don't use await
  //2.sorting
  // if(req.query?.sort){
  //     const sortBy = req.query.sort.split(',').join(' '); //tour?sort=price,ratingAvg
  //     query = query.sort(sortBy);  //sortBy = 'price ratingAvg'
  // }else{
  //     query = query.sort('-createdAt'); // - reverse the sorting order
  // }
  //3.field limiting
  // if(req.query?.fields){
  //     const fields = req.query.fields.split(',').join(' ') //tour?fields=name,cityName,price,ratingAvg
  //     query = query.select(fields); //fields = 'name cityName price ratingAvg'
  // }else{
  //     query = query.select('-__v');
  // }
  //4. Pagination
  // const page =req.query?.page*1 || 1; //here we multiply by 1 to convert into int
  // const limit = req.query?.limit*1 || 10;
  // const skip = (page - 1)*limit;
  // if(req.query?.page){
  //     const totalTours = await Tour.countDocuments();
  //     if(skip >= totalTours) throw new Error('page does not exist!');
  // }
  // query = query.skip(page).limit(limit);
  //execute query
  // const tours = await query;
  // const tours = await Tour.find();

  // const cachedData = await redis.get('tour-data');
  // const toursfromRedis = JSON.parse(cachedData);
  
    const features = new APIFeature(
      Tour.find().populate({
        path: "guide",
        select: "-__v -passwordChangedAt -password -isActive",
      }),
      req.query,
      )
      .filter()
      .sort()
      .fieldLimit()
      .paginate();
     const tours = await features.query;
      if (!tours) {
        return next(
          new AppError("There is no such tour with the provided filters.", 404),
          );
        }
        const redisRes = await redis.set("tour-data", JSON.stringify(tours));
        console.log('redisRes',redisRes);
        // await redisClient.disconnect();

  res.status(200).json({
    status: "success",
    message: "Tours data fetched successfully",
    results: tours.length,
    data: tours,
  });
});

// const getTourById = catchAsync(async(req, res, next) =>{
//     const id = req.params.id;
//     const tour =  await Tour.findById({ _id: id }).populate({path:'guide', select:'-__v -passwordChangedAt -password -isActive'});
//     if(!tour){
//         return next(new AppError(`There is no tour with this id ${id}`, 404));
//     }
//     res.status(200).json({
//         status: "success",
//         message: `Tour with id ${id} fetched successfully`,
//         data: tour
//     })
// });

// const deleteTourById = catchAsync(async(req, res, next) =>{
//     const id = req.params.id;
//     const delRes = await Tour.findByIdAndDelete({ _id: id});
//     if(!delRes){
//         return next( new AppError(`There is no such tour with id ${id}`, 404));
//     }
//     res.status(200).json({
//         status: "success",
//         message: `Tour with id ${id} deleted successfully`
//     });
// });

const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  if (!lng || !lat) {
    return next(
      new AppError(
        "Please provide latitude and langitude in a correct format",
        401,
      ),
    );
  }
  console.log(distance, lng, lat, unit);
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1; // deviding miles and km to convert in radians bcz in geoWithin function it should be in the same unit
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lat, lng], radius] } },
  });
  res.status(200).json({
    status: "success",
    tours,
  });
});

const getToursDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  if (!lng || !lat) {
    return next(
      new AppError(
        "Please provide latitude and langitude in a correct format",
        401,
      ),
    );
  }
  console.log(lng, lat, unit);
  const multiplier = unit === "mi" ? 0.000621371 : 0.001; // deviding miles and km to convert in radians bcz in geoWithin function it should be in the same unit
  const tours = await Tour.aggregate([
    {
        $geoNear:{
            near:{
                type: 'Point',
                coordinates: [lat * 1, lng * 1]
            },
            distanceField: 'distance',
            distanceMultiplier: multiplier
        },
    },
    {
        $project:{
            distance: 1,
            name: 1
        }
    }
  ])
  res.status(200).json({
    status: "success",
    tours,
  });
});

const getTourById = getOne(
  Tour,
  (popOptions = {
    path: "guide",
    select: "-__v -passwordChangedAt -password -isActive",
  }),
);
const updateTourById = updateOne(Tour);

const deleteTourById = deleteOne(Tour);

module.exports = {
  createTour,
  getAllTour,
  getTourById,
  deleteTourById,
  updateTourById,
  topTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getToursDistances
};
