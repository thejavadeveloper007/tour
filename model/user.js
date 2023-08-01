const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto =  require('crypto');

const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, 'Please enter your name']
},
email: {
type: String,
unique: true,
required: [true, 'Please enter a correct email address'],
lowercase: true,
validate: [validator.isEmail, 'Please provide a valid email!']
},
photo:{
    type: String
},
role:{
    type: String,
    enum:['user','admin','guide','lead-guide'],
    default: 'user'
},
password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 8
},
confirmPassword: {
    type: String,
    required: [true, 'Please provide confirm password'],
    validate: {
        //this only works for save
        validator: function(el){
            return el === this.password;
        },
        message: 'password are not same'
    }
},
passwordChangedAt: {
    type: Date
},
passwordResetToken:{
    type: String
},
resetTokenExpitesIn: Date,
isActive: {
    type: Boolean,
    default: true
}
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    //hash the password with the cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    //delete confirmPassword field
    this.confirmPassword = undefined;
    next();
});

userSchema.pre(/^find/, function(next){
    //filtering only active user while each find query
    // this.find({isActive: true});
    this.find({isActive:{$ne: false}});
    next();
})

userSchema.methods.correctPassword = function(cadidatePassword, userPassword){
    return bcrypt.compare(cadidatePassword, userPassword);
}

userSchema.methods.passwordChanged = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        console.log(JWTTimeStamp, this.passwordChangedAt);
        const passwordChangedTime =  this.passwordChangedAt.getTime()/1000;
        return JWTTimeStamp < passwordChangedTime;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log('resetttoken',resetToken);
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('passreset',this.passwordResetToken);
    this.resetTokenExpitesIn = Date.now() + 10*60*1000;
    return resetToken;
}

const User = mongoose.model('User',userSchema);

module.exports = User;