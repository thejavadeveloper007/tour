const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../model/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');


const protect = async(req, res, next) =>{
    let token
    //1. get the token from headers
    if(req.headers?.authorization && req.headers?.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in! Please login again to get access'));
    }
    //2. verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // if(!decoded){
    //     return next(new AppError('Invalid token! Please login again', 401));
    // }
    // console.log('decoded',decoded); 
    //check if user still exist
    const currentUser = await User.findById(decoded?.id);
    if(!currentUser){
        return next(new AppError('The user no longer available for this token/id',401));
    }
    //check if password changed
    if(currentUser.passwordChanged(decoded.iat)){
        return next(new AppError('Password changed! please login with new password', 401));
    }
    //grant access to protected route
    req.user = currentUser;
    next(); 
}

const restrictTo = (...roles) =>{
  return (req, res, next) =>{
    if(!roles.includes(req.user.role)){
        return next(new AppError('You do not have permission to perform this action!', 403));
    }
    next();
  }
}

const forgotPassword = catchAsync(async(req, res, next) =>{
    const user = await User.findOne({email: req.body.email});
    //first check if user available
    if(!user){
        return next(new AppError('No user exist with this email', 404));
    }
    //generate a password reset token
    const resetToken = user.createPasswordResetToken();
    console.log('reset token 54',resetToken);
    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`;
    const message = `To reset your password plaese click the link ${resetUrl} and if not required, plaese ignore this.`
   try {
    await sendEmail({
        email: user.email,
        subject: 'This reset link is active for 10min only.',
        message
    });
    res.status(200).json({
        status: "success",
        message: "Reset link sent successfully to your email."
    });
   } catch (error) {
    user.passwordResetToken = undefined;
    user.resetTokenExpitesIn = undefined;
    user.save({validateBeforeSave: false});
    return next(new AppError('There was an error sending email, please try again!', 500));
   }
});

const resetPassword = catchAsync(async(req, res, next) =>{
    const { password, confirmPassword } = req.body;
    // const savePassword = await User.findOneAndUpdate({email: email},{$set:{password: password, confirmPassword: confirmPassword}},{new: true});
   const { resetToken } = req.params;
   //find the user with token
   const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   const user = await User.findOne({passwordResetToken: hashedToken});
   if(!user){
    return next(new AppError('Token is invalid or has expired!', 400));
   }
   //if user then set new password and other required field
   user.password = password;
   user.confirmPassword = confirmPassword;
   user.passwordResetToken = undefined;
   user.resetTokenExpitesIn = undefined;
   user.passwordChangedAt = Date.now();
   await user.save();
   //generate the token for accessing other services
   const token = getToken(user._id);
    res.status(200).json({
        status: "success",
        message: "Password reset successfully.",
        token
    });
});

const updatePassword = catchAsync(async(req, res, next) =>{
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.user;
        //find the current user
        const user = await User.findById(userId);
        if(!user){
            return next(new AppError('No user found, please login again', 401));
        }
        //compare user input password with old one
        const isCorrect = await user.correctPassword(oldPassword, user.password);
        if(!isCorrect){
            return next(new AppError('Please provide the correct old password or go with forgot password.', 400));
        }
        //update with new password
        user.password = password;
        user.confirmPassword = confirmPassword;
        user.passwordChangedAt = Date.now();
        await user.save();
        //send jwt token
        const token = getToken(userId);
        res.status(200).json({
            status: "success",
            message: "Password updated successfully."
        })
});

const getToken = id => {
    const token = jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    return token;
}
// for now we are storing it from client side/front end
// const storeTokenToCookies = (user, satusCode, res) =>{
//     const token = getToken(user._id);
//     const cookieOptions = {
//         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
//         httpOnly: true
//     }
//     if(process.env.NODE_ENV == 'production') cookieOptions.secure = true;
//     res.cookie('jwt', token, cookieOptions);
//     //to remove password from response only
//     user.params = undefined;
//     res.status(statusCode).json({
//         status: "success",
//         token,
//         data: user
//     })
// }
const signUp = catchAsync(async(req,res) => {
    const { name, email, password, confirmPassword, passwordChangedAt, role } = req.body;

    const newUser = await User.create({name: name, email: email, password: password, confirmPassword: confirmPassword, passwordChangedAt: passwordChangedAt, role: role});

    const token = await getToken(newUser._id);

    res.status(200).json({
        status: "success",
        message: "User created successfully.",
        token,
        data: newUser
    })
});

const loginUser = catchAsync(async(req, res, next) =>{
    const { email, password } = req.body;
    //check fields are not empty
    if(!email || !password){
        return next(new AppError('Email or Password are missing!', 400));
    }
    //check if user exist
    const user = await User.findOne({email: email});
    if(!user || !await user.correctPassword(password, user.password)){
        return next(new AppError('Incorrect email or password!', 401));
    }
    const token = await getToken(user._id);
    res.status(200).json({
        status: "success",
        token: token,
        id: user._id
    })
    
});

const googleLogin = catchAsync(async(req, res) =>{
    const { email } = req.body.data;
    const user = await User.findOne({email: email});
    let token
    if(user){
     token = await getToken(user?._id);
    }
    res.status(200).json({
        status: "success",
        token: token,
        id: user?._id
    });
})

module.exports = { signUp, loginUser, protect, restrictTo, forgotPassword, resetPassword, updatePassword, googleLogin }