// import mongoose from "mongoose";
// process.on('uncaughtException', err =>{
//     console.log(err.name, err.message);
//     console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//     //here we can directly exit the process without closing the server bcz the processes handled here are asynchronous
//     process.exit(1); //here 0 stands for success and 1 stands for exceptions
// });

const app = require('./app')
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./model/review');

const dbUrl = process.env?.DB;
const port = process.env.PORT;

console.log('url',dbUrl);
//establish connection
mongoose.connect(dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con =>{
    console.log('DB connection successful');
    // Review.createIndexes((err) => {
    //     if (err) {
    //     console.error('Error creating indexes:', err);
    //     } else {
    //     console.log('Indexes created successfully');
    //     }
    //     });
}).catch((err)=> console.log(err));

const server = app.listen(port, ()=>{
    console.log(`application listning on ${port}...`);
});

// process.on('unhandledRejection', err =>{
//     console.log(err.name, err.message);
//     console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//     //here we are closing server first then app instead of abruptly close all running requests
//     server.close(() =>{
//     process.exit(1); //here 0 stands for success and 1 stands for exceptions
//     })
// });
