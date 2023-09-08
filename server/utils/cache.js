const mongoose = require("mongoose");
const redis = require("../controller/redisSetup");
// const util = require("util");

// const redisUrl = "redis://127.0.0.1:6379";
const exec = mongoose.Query.prototype.exec;

// const client = redis.createClient(redisUrl);
// client.get = util.promisify(client.get);
mongoose.Query.prototype.cache = function(options = {}){
  console.log('11-----------');
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
}

mongoose.Query.prototype.exec = async function () {
  if(!this.useCache){
    console.log('18-------- ');
    return exec.apply(this, arguments);
  }
  console.log("I AM ABOUT TO RUN QUERY");
  console.log(this.getQuery());
  console.log(this.mongooseCollection.name);
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name,
  }));
  console.log("key", key);
  const cachedValue = await redis.hget(this.hashKey, key);
  if(cachedValue){
    console.log('cached value',cachedValue);
    // return JSON.parse(cachedValue);
    const doc = JSON.parse(cachedValue); //we can send cached value directly but we need to send as a model format
    return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
  }
  console.log('arg',arguments);
  const data = await exec.apply(this, arguments);
  console.log('data 24',data);
  redis.hmset(this.hashKey, key, JSON.stringify(data), 'EX', 10); //hmset for multiple args we are using over here
  return data;
};

module.exports = {
  clearCache(hashKey){
    redis.del(JSON.stringify(hashKey))
  }
}