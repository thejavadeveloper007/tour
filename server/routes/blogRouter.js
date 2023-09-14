const express = require('express');

const blogRouter = express.Router();
const cleanCache = require('../middleware/cacheMid');
const { protect } = require('../controller/authController');
const { blogPost, getBlogs } = require('../controller/blogController');
const { getAWSSignedUrl } = require('../controller/awsController');

blogRouter
        .get('/', protect, getBlogs)
        .post('/', protect, cleanCache, blogPost)
        

blogRouter
        .post('/signedUrl', protect, getAWSSignedUrl)
        

module.exports = blogRouter;