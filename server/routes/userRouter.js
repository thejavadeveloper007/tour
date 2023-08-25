const express = require('express');
const { signUp, loginUser, protect, forgotPassword, resetPassword, updatePassword, restrictTo, googleLogin } = require('../controller/authController');
const { updateMe, deleteMe, deleteUser, updateById } = require('../controller/userController');

userRouter = express.Router();

userRouter
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
