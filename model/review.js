const { default: mongoose } = require("mongoose");
const Tour = require('./tour');

const reviewSchema = new mongoose.Schema({
review:{
    type: String,
    required: true
},
rating:{
    type: Number,
    default: 4.5,
    min: 0,
    max: 5 
},
user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must be a user']
    },
tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must be a tour']
    },
createdAt: {
    type: Date
},
},
{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});
reviewSchema.index({tour: 1, user: 1},{unique: true}); //this will prevent duplicate review by restricting to the unique combo of user and tour id

reviewSchema.statics.calcAvgRatings = async function(tourId){
    console.log('35');
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group:{
                _id: '$tour',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating'}
            }
        }
    ])
    console.log('stats',stats);
    //now save this avg rating and Qty to the same tour
    await Tour.findByIdAndUpdate(tourId,{
        ratingAvg: stats[0].avgRating,
        ratingQty: stats[0].nRatings
    })
}

reviewSchema.pre('save', function(next){
    console.log('56');
    this.createdAt = Date.now();
    next();
})
reviewSchema.pre(/^find/, function(next){
    console.log('60');
    this.populate({
        path:'tour',
        select:'name cityName price'
    }).populate({
        path:'user',
        select:'name'
    })
    next();
})
reviewSchema.post('save', function(){
    console.log('71');
    //this.constructor is equal to Review model
    this.constructor.calcAvgRatings(this.tour);
})
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next){
    console.log('77');
    this.r = this.findOne(); // r is not the new data query we are goin to update, it is the old data from db
    console.log('r',this.r);
    next();
})

    reviewSchema.post(/^FindOneAnd/, async function(){
        console.log('87');
        //await this.findOne does not work here bcz query already executed
       await this.r.constructor.calcAvgRatings(this.r.tour);
    })


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review