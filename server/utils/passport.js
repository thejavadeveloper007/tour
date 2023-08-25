// const User = require('../model/user');

// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passport = require('passport');

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: "",
//             clientSecret: "",
//             callbackURL: "http://localhost:7007/auth/google/callback",
//             scope:['email','profile']
//         },
//        async function (accessToken, refreshToken, profile, done){
//             console.log('profile',profile);
//             try {
//           const user =  await User.findOne({ email: profile.emails[0].value }) 
//           console.log('user 18',user);
//                 if(user){
//                   return done(user);
//                 }else{
//                     user = new User({
//                         googleId: profile.id,
//                         email: profile.emails[0].value,
//                         name: profile.name.displayName,
//                         isActive: true
//                       });
//                      await user.save();
//                      console.log('user 29', user);
//                     return done(null, user);
//                 }
//             } catch (error) {
//                 return done(error);
//             }           
//         }
//             )
//     );

// passport.serializeUser((user,done) =>{
//     done(null,user);
// });

// passport.deserializeUser((user,done) =>{
//     done(null,user);
// });