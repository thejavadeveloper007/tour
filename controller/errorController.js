const AppError = require('../utils/appError');

const sendDevErr = (err, res) =>{
    console.log('...err',{...err});
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendProdErr = (err, res) =>{
    // const error = new Error();
    // console.log('error 14',error);
    console.log('send error',err);
    //Operational error are trusted: send these to client
  if(err.isOperational){
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
    //Programing or other unknown error: don't leak them
  }else{
    //1.log the error
    console.log('Error 💥');
    //2. show generic error message
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
    })
  }
}

// const handleCastError = (id, err) =>{
//     const message = `Invalid _id: ${id} or ${err.message}`;
//     return new AppError(message, 400);
// }

const handleDuplicateValues = err =>{
    // const value = err.message.match(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/);
    // console.log('value',value);
    const message = `Duplicate field value ${err.keyValue.id}, Please enter unique value.`;
    return new AppError(message, 400);
}

const handleValidationError = err => {
    const errors = Object.values(err.errors).map((ele) => ele.message);
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400);
}

const handleJWTError = err => {
    return new AppError('Invalid token ! Please login again', 401);
}
const handleTokenExpiredError = err =>{
    return new AppError('Token expired! please login again.', 401);
}

module.exports = (err,req,res,next) =>{
    // const id = req.params.id;
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if(process.env.NODE_ENV === 'development'){
        sendDevErr(err, res);
    }else if(process.env.NODE_ENV === 'production'){
        console.log('Error',err);
        let error = {...err};
        console.log('error 68',err);
        // if(err.name === 'BSONError'){
        //     error = handleCastError(id, err);
        // }else{
        // } 
        if(err.code === 11000){
            error = handleDuplicateValues(error);
        }
        if(err.name === 'JsonWebTokenError') error = handleJWTError(error)
        if(err.name === 'ValidationError') error = handleValidationError(error)
        if(err.name === 'TokenExpiredError') error = handleTokenExpiredError(error)
        sendProdErr(error, res);
    }
}