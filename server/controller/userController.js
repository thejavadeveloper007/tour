const User = require("../model/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { deleteOne, updateOne } = require("../controller/handlerFactory");
const { default: mongoose } = require("mongoose");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const Email = require("../utils/email");

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) =>{
//         cb(null, path.join(__dirname,'../public/img/user'));
//     },
//     filename: (req, file, cb) =>{
//         console.log('req 14',req.body);
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//     }
// })

//if we want to store image as a buffer
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log("reqbody", req.body);
  console.log("file", req.file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image! please upload a correct image.", 400),
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single("photo");
const resizeImage = (req, file, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;
  console.log("filename", file.filename);
  console.log("buffer", req.file.buffer);
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/user/${req.file.filename}`);
  // const ext = file.mimetype.split('/')[1];
  // req.file.fileName = `user-${req.user._id}-${Date.now()}.${ext}`;
  next();
};

const getUserById = catchAsync(async (req, res, next) => {
  const user = req.user;
  console.log("enter in user req");
  res.status(200).json({
    status: "success",
    message: `User fetched successfully.`,
    data: user,
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  console.log("file", req.body);
//   req.body.photo = req.file.originalname;
  // const { name, email } = req.body;
  const userId = req.user;
  const user = await User.findById(userId);
  if (!user) {
    return next(
      new AppError(
        "User does not exist with this id or something went wrong!",
        401,
      ),
    );
  }
  const updatedUser = await User.findByIdAndUpdate(
    { _id: new mongoose.Types.ObjectId(userId) },
    { $set: req.body },
    { runValidators: true, new: true },
  );
  //     user.name = name;
  //     user.email = email;
  //    const updatedUser = await user.save();
  res.status(200).json({
    status: "success",
    message: `User updated successfully.`,
    data: updatedUser,
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user,
    { isActive: false },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: `User deleted successfully.`,
    data: user,
  });
});

const deleteUser = deleteOne(User);
const updateById = updateOne(User);

module.exports = {
  updateMe,
  deleteMe,
  deleteUser,
  updateById,
  uploadUserPhoto,
  getUserById,
  resizeImage
};
