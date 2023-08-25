class AppError extends Error{
    constructor(message, statusCode){
        console.log('message',message,'statusCode',statusCode);
        super(message);
        // this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;