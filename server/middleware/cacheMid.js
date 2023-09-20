const { clearCache } = require('../utils/cache');

module.exports = async (req, res, next) =>{
await next();
console.log('user id 5',req?.user?._id);
clearCache(req?.user?._id);
}