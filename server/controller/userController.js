const User = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne } = require('../controller/handlerFactory');
const { default: mongoose } = require('mongoose');

const updateMe = catchAsync(async(req, res, next) =>{
    const { name, email } = req.body;
    const userId = req.user; 
    const user = await User.findById(userId);
    // const user = await User.findByIdAndUpdate({_id: userId},{$set:{name: name, email: email}},{runValidators: true, new: true});
    if(!user){
        return next(new AppError('User does not exist with this id or something went wrong!', 401));
    }
    user.name = name;
    user.email = email;
    user.save();
    res.status(200).json({
        status: "success",
        message: `User updated successfully.`,
        data: user
    })
});

const deleteMe = catchAsync(async(req, res, next) =>{
    const user = await User.findByIdAndUpdate(req.user,{isActive: false}, {new: true});
    res.status(200).json({
        status: "success",
        message: `User deleted successfully.`,
        data: user
    })
});

const deleteUser = deleteOne(User);
const updateById = updateOne(User);

module.exports = { updateMe, deleteMe, deleteUser, updateById }