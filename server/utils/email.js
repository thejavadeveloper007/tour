const nodemailer = require("nodemailer");
const catchAsync = require("./catchAsync");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    console.log('url', url);
    this.to = user.email;
    this.firstName = user?.name?.split(" ")[0];
    this.url = url;
    this.from = `Rakesh Seervi <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return 1;
      // Sendgrid
      //   return nodemailer.createTransport({
      //     service: 'SendGrid',
      //     auth: {
      //       user: process.env.SENDGRID_USERNAME,
      //       pass: process.env.SENDGRID_PASSWORD
      //     }
      //   });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT*1,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  // Send the actual email
  async send(templateName, subject) {
    const data = {
      firstName: this.firstName,
      url: this.url,
      subject,
    };
    let templatePath;
    // Read the EJS template file
    if (templateName == "welcome") {
      templatePath = path.join(`${__dirname}/../`, "template", "welcomeTemplate.ejs");
    }
      if(templateName == 'passwordReset'){
       templatePath =  path.join(`${__dirname}/../`, 'template', 'passwordReset.ejs');
    }
    const template = fs.readFileSync(templatePath, "utf-8");
    // Compile the template
    const compiledTemplate = ejs.compile(template);
    // 1) Render HTML template using the dynamic data
    const html = compiledTemplate(data);
    console.log('html', html);
    // const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    //   firstName: this.firstName,
    //   url: this.url,
    //   subject,
    // });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

    async sendPasswordReset() {
      await this.send(
        'passwordReset',
        'Your password reset token (valid for only 10 minutes)'
      );
    }
};

// const senEmail = catchAsync(async(options) =>{
//     //1.create transporter
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });
//     //2.create options
//     const mailOptions = {
//         from: 'Rakesh Seervi <rakeshbarfa@gmail.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     }
//     //3.send the email
//     await transporter.sendMail(mailOptions);
// });

// module.exports = senEmail;
