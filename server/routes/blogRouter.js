const express = require('express');

const blogRouter = express.Router({ mergeParams: true});
const cleanCache = require('../middleware/cacheMid');
const { protect } = require('../controller/authController');
const { blogPost, getBlogs, deleteBlogById } = require('../controller/blogController');
const { getAWSSignedUrl } = require('../controller/awsController');

blogRouter
        .get('/', protect, getBlogs)
        .post('/', protect, cleanCache, blogPost)
        .delete('/:id',protect, cleanCache, deleteBlogById)
        

blogRouter
        .post('/signedUrl', protect, getAWSSignedUrl)
        

module.exports = blogRouter;