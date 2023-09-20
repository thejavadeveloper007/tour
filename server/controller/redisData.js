const redis = require('./redisSetup');
const catchAsync = require('../utils/catchAsync');
// const { redisClient } = require('../server');

// const redisClient = redis.createClient();
const getDataFromRedis = (key) =>{
    console.log('key',key);
    return catchAsync(async(req, res, next) =>{
        // await redisClient.connect();
       const cachedData = await redis.get(key);
       const tours = JSON.parse(cachedData);
       if(tours.length > 0){
        // await redisClient.disconnect();
        return res.status(200).json({
            status: 'success',
            message: 'Tours data fetched successfully with redis',
            data: tours
        })
       }
    //    await redisClient.disconnect();
        next();
    })
}

module.exports = { getDataFromRedis };