const express = require('express');

const blogRouter = express.Router();
const cleanCache = require('../middleware/cacheMid');
const { protect } = require('../controller/authController');
const { blogPost, getBlogs } = require('../controller/blogController');

blogRouter
        .get('/', protect, getBlogs)
        .post('/', protect, cleanCache, blogPost);

module.exports = blogRouter;