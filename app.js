// import express from 'express';
const express = require('express');

// import dotenv from 'dotenv';
// import morgan from 'morgan';
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

// import tourRouter from './routes/tourRouter.js';
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const resRouter = require('./routes/resRouter');
const reviewRouter = require('./routes/reviewRouter');

const app = express();
// const config = dotenv.config();
//GLOBAL MIDDLEWARE
app.use(helmet()); // Set security http headers
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev')); // logging in development mode
}
//limit number of request from the same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later.'
})
app.use('/api',limiter);
//this will convert each req res body to json
app.use(express.json({limit: '10kb'})); //only accept limited size data 
app.use(mongoSanitize()); //Data sanitization against NoSQL query injection and  sequence matters here
app.use(xss()); //Data sanitization against XSS (cross-site-scripting) like someone want to inject html script..
app.use(hpp({
    whitelist:[
        'page',
        'price',
        'duration',
        'difficulty'
    ]
})); //Prevent http parameter polution like sending duplicate key in headers or in query, also we can define a list to accept duplicasy
app.use(express.static(`${__dirname}/public`)); //serving static files
//get req time 
app.use((req,res,next) =>{
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/restraunt', resRouter);
app.use('/api/v1/review', reviewRouter);

app.all('*',(req,res,next) =>{
    next( new AppError(`Path url ${req.originalUrl} is incorrect!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;