const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');

const senEmail = catchAsync(async(options) =>{
    //1.create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    //2.create options
    const mailOptions = {
        from: 'Rakesh Seervi <rakeshbarfa@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    //3.send the email
    await transporter.sendMail(mailOptions);
});

module.exports = senEmail;