const catchAync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blog = require("../model/blog");
// const { clearCache } = require('../utils/cache');

const blogPost = catchAync(async (req, res, next) => {
  const { blogContent } = req.body;
   console.log('blog post..........');
  const _id = req?.user?._id;
  const blog = await Blog.create({ userId: _id, blogContent: blogContent });
  if (!blog) {
    return next(new AppError("there is an error while creating blog!", 400));
  }
  // clearCache("64e596b27aa3f361b3a2bcff");
  res.status(200).json({
    status: "success",
    data: blog,
  });
});

const getBlogs = catchAync(async (req, res, next) => {
  // const { _id } = req.user;
  console.log('get blogs...........');
  const _id = req?.user?._id;
  const blog = await Blog.find({ userId: _id }).cache({ key: _id });
  if (!blog) {
    return next(new AppError("there is an error while fetching blog!", 400));
  }
  res.status(200).json({
    status: "success",
    data: blog,
  });
});


module.exports = { blogPost, getBlogs };
