// const express = require('express');
// const passport = require('passport');
// const authRouter = express.Router();
// const jwt = require('jsonwebtoken');

// authRouter.get("/login/success",(req,res) =>{
//     if(req.user){
//         res.status(200).json({
//             error:false,
//             message: "successfully logged in.",
//             user: req.user
//         })
//     }else{
//         res.status(403).json({
//             error: 4003,
//             message: "Unauthorized login!"
//         })
//     }
// })

// authRouter.get("/login/failed",(req,res) =>{
//     res.status(401).json({
//         error: true,
//         message: "log in failure!"
//     })
// })
// authRouter.get("/google", passport.authenticate("google",["profile, email"]));

// authRouter.get(
//     "/google/callback",
//     passport.authenticate('google',{
//         successRedirect: process.env.CLIENT_URL,
//         failureRedirect: "/login/failed"
//     }
//     )
//     )
//     // (req, res) => {
//     //         console.log('req',req);
//     //         const token = jwt.sign({ id: req._id }, process.env.JWT_SECRET, { expiresIn: '10 h' });
//     //         console.log('token 38',token);
//     //         return token;
//     //       }
// authRouter.get("/logout",(req,res) =>{
//     req.logout();
//     res.redirect(process.env.CLIENT_URL)
// })

// module.exports = authRouter;
