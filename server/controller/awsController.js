const AWS = require('aws-sdk');
const uuid = require('uuid');
const dotenv = require('dotenv');

const catchAsync = require('../utils/catchAsync');

dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const signatureVersion = 'v4';
// AWS.config.update();
 const s3 = new AWS.S3({ 
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion
});
const myBucket = process.env.AWS_BUCKETNAME;
const signedUrlExpireSeconds = 60 * 5

const getAWSSignedUrl = catchAsync(async(req,res,next) =>{
    console.log('getSigne', req.body);
    const { fileName, fileType } = req.body;
    const key = `${fileName}/${req.user._id}/${uuid.v4()}.${fileType.split('/')[1]}`;
    const url = await s3.getSignedUrlPromise('putObject',{
        Bucket: myBucket,
        Key: key,
        Expires: signedUrlExpireSeconds
      });
      console.log('url',url);
      res.send({url})
});

module.exports = { getAWSSignedUrl }