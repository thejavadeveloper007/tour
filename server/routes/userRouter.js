const express = require('express');
// const multer = require('multer');
const { signUp, loginUser, protect, forgotPassword, resetPassword, updatePassword, restrictTo, googleLogin } = require('../controller/authController');
const { updateMe, deleteMe, deleteUser, updateById, uploadUserPhoto, getUserById, resizeImage } = require('../controller/userController');
const { getAWSSignedUrl } = require('../controller/awsController');

// const upload = multer({ dest: 'public/img/user'});

userRouter = express.Router();

userRouter
.get('/getUserById', protect, getUserById)
.post('/signup', signUp)
.post('/login', loginUser)
.post('/google-login', googleLogin)
.patch('/updateMe', protect, updateMe)
.patch('/deleteMe', protect, deleteMe)

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:resetToken', resetPassword);
userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.delete('/:id', protect, restrictTo('admin'), deleteUser);
userRouter.patch('/:id', protect, restrictTo('admin'), updateById);

module.exports = userRouter;
