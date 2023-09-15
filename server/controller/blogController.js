const catchAync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blog = require("../model/blog");
const { default: mongoose } = require("mongoose");
// const { clearCache } = require('../utils/cache');
const { deleteOne } = require('./handlerFactory');

const blogPost = catchAync(async (req, res, next) => {
  const { title, content, imageUrl } = req.body;
   console.log('blog post..........file',req.body);
  const _id = req?.user?._id;
  const blog = await Blog.create({ userId: _id, title: title, blogContent: content, imageUrl: imageUrl });
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

// const deleteBlogById = catchAync(async(req, res, next)=>{
//     const { id } = req.params;
//     console.log('id',id);
//     const deleteBolg = await Blog.findByIdAndDelete(new mongoose.Types.ObjectId(id));
//     console.log('delete res',deleteBolg);
//     if(deleteBolg){
//       res.status(200).json({
//         status: "success",
//         message: "Blog deleted successfully."
//       });
//     }else{
//       return next(new AppError('Issue with blog deletion!', 400));
//     }
// })

const deleteBlogById = deleteOne(Blog);

module.exports = { blogPost, getBlogs, deleteBlogById };
