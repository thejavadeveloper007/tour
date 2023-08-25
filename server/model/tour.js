// import mongoose from "mongoose";
const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  id:{
    type: Number,
    required: true,
    unique: true
  },
    name: {
        type: String,
        required: [true, 'A tour name must be there'],
        unique: true,
        trim: true,
        maxlength:[30, 'A name can have only 30 characters!'],
      },
      slug: String,
      startDates:[{
        type: Date,
        required: [true, 'A tour startDate must be there'],
      }],
      startLocation: {
        description: String,
        type: {
          type: String,
          default: 'Point'
        },
        coordinates: [Number],
        address: String
      },
      locations: [{
        description: String,
        type: {
          type: String,
          default: 'Point'
        },
        coordinates: [Number],
        day: Number
      }],
      durationInHours: {
        type: Number,
        required: [true, 'A tour duration must be there'],
      },
      description: {
        type: String,
        select: false
      },
      cityId: {
        type: Number,
        required: [true, 'A tour cityId must be there'],
      },
      cityName: {
        type: String,
        required: [true, 'A tour cityName must be there'],
      },
      imageCover: {
        type: String
      },
      images: [{
        path: {
          type: String
        }
      }],
      shortDisplayName: {
        type: String
      },
      priority: {
        type: Number
      },
      difficulty:{
        type: String,
        enum:{
          values:['easy','medium','hard'],
          message: 'difficulty may either easy,medium or hard'
        }
      },
      price: {
        type: Number,
        required: [true, 'A tour price must be there'],
      },
      priceDiscount:{
        type: Number,
        validate:{
          validator: function(val){
            //this only point to current doc on new doc creation
            return val < this.price;
          },
          message:'Discount price ({VALUE}) should be less than regular price!' // here {VALUE} get the value from val attribute
        }
      },
      ratingAvg: {
        type: Number,
        default: 0,
        min:[0, 'A rating can not be negative!'],
        max:[5, 'Max rating is 5 only!'],
        set: val => Math.round(val * 10) / 10 //4.6666 => 46.666 => 47 => 4.7
      },
      ratingQty: {
        type: Number,
        default: 0
      },
      highlighted: {
        type: Boolean,
        default: false
      },
      secretTour:{
        type: Boolean,
        default: false,
        select: false
      },
      guide: [
       {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
       }
      ],
      createdAt: {
        type: Date,
        default: Date.now
      }
}, {
  toJSON:{ virtuals: true}, // when we are getting result as JSON or Object
  toObject:{ virtuals: true}
});

tourSchema.index({ price: 1, ratingAvg: 1});
tourSchema.index({ slug: 1});
tourSchema.index({ startLocation: '2dsphere'});
tourSchema.index({ geoNear: '2dsphere'})

tourSchema.virtual('durationInDays').get(function(){
  return this.durationInHours/24; // here this represent the current document
});
// tourSchema.virtual('review', {
//   ref: 'Review',
//   foreignField:'tour',
//   localField: '_id'
// })
// Document Middleware: these middleware gonna hit before save() or create() execute not while update
tourSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower:true})
  next();
});
// tourSchema.pre('save', async function(next){
//   const guidePromise = this.guide.map(async id => await User.findById(id)); //id will be taken from the guide array and data of the same guide will be mapped in here.
//   this.guide = await Promise.all(guidePromise);
//   next();
// })
// tourSchema.post('save', function(doc, next){
//   console.log('doc',doc);
//   next();
// })
// Query Middleware: 
tourSchema.pre(/^find/, function(next){ // here this middleware gonna apply to each query which start with 'find'
  this.find({secretTour:{$ne: true}});
  this.start = Date.now();
  next();
  });
// tourSchema.pre(/^find/, function(next){
//   this.populate({
//     path:'guide',
//     select:'-__v -passwordChangedAt -password -isActive'
//   });
//   next();
// })
tourSchema.post(/^find/, function(doc, next){
  console.log(`Query took ${Date.now()- this.start} miliseconds`);
  next();
})
// tourSchema.pre('findOne', function(next){ //only apply to the Query starts with findOne
//   this.find({secretTour:{ $ne: true}});
//   next();
// });
//AGGREGATION MIDDLEWARE: used to get access to aggregation pipeline object or function
// tourSchema.pre('aggregate', function(next){
//   this.pipeline().unshift({$match: { secretTour: { $ne: true}}}); // unshift is js function which used for add an element in the begining of the array
//   console.log('pipeline',this.pipeline());

//   next();
// })
const Tour = mongoose.model('Tour',tourSchema); // schema to model so that we can perform operations directly with the Tour name 

module.exports = Tour;