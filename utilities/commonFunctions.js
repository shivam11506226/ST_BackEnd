const nodemailerConfig = require("../config/nodeConfig");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("../config/auth.config.js");
let cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dultedeh8",
  api_key: "461991833927796",
  api_secret: "ruuF-4CFhQVh205cif_tQqNBBcA",
});

module.exports = {
  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },

  getToken: async (payload) => {
    var token = await jwt.sign(payload, config.secret, { expiresIn: "24h" });
    return token;
  },

  sendSignUpEmailOtp: async (to, otp) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <title></title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                            style="width: 30%;" alt="logo">
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
                                ${otp} is your OTP for signing up for skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailerConfig.createTransport({
      service: nodemailerConfig.service,
      auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Verification Mail",
      html: html,
    };
    return await transporter.sendMail(mailOptions);
  },

  sendSignUpEmailOtp: async (to, otp) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title></title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                            style="width: 30%;" alt="logo">
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
                                ${otp} is your OTP for signing up for skyTrails.
                        
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailerConfig.createTransport({
      service: nodemailerConfig.service,
      auth: {
        user: nodemailerConfig.user,
        pass: nodemailerConfig.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.user,
      to: to,
      subject: "Verification Mail",
      html: html,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  sendHotelBookingConfirmation: async (to) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title></title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                            style="width: 30%;" alt="logo">
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                                you are booked hotel successfully from skyTrails.<br>Yor details is:=== <br>hotelName:${to.hotelName}<br>CheckInDate:${to.CheckInDate}<br>CheckOutDate:${to.CheckOutDate}<br>noOfPeople: ${to.noOfPeople}<br>night: ${to.night}<br>room:${to.room}<br>
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Hotel Booking Confirmation",
      html: html,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  sendBusBookingConfirmation: async (to) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title></title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                            style="width: 30%;" alt="logo">
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                                you are booked bus successfully from skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Hotel Booking Confirmation",
      html: html,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Visa Apply Confirmation Mail =======
  //==========================================================

  VisaApplyConfirmationMail: async (to) => {
    let html = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <title>VisaApplyConfirmationMail</title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                            style="width: 30%;" alt="logo">
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                                Your Visa Application successfully from skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Visa Apply Confirmation Mail",
      html: html,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  //==========================================================
  //========== Send Email Flight Booking Confirmation Mail =======
  //==========================================================

  FlightBookingConfirmationMail: async (to, pdfFilePath) => {
    let html = `<!DOCTYPE html>S
        <html lang="en">
        
        <head>
            <title>VisaApplyConfirmationMail</title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                            style="width: 30%;" alt="logo">
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                                Your Flight Booking successfully from skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    const passengerEmail = to.passengerDetails[0].email;
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: passengerEmail,
      subject: "Flight Booking Confirmation Mail",
      html: html,
      attachments: [{ filename: "api_data.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

   //==========================================================
  //========== Send Email Bus Booking Confirmation Mail =======
  //==========================================================

  BusBookingConfirmationMail: async (to, pdfFilePath) => {
    let html = `<!DOCTYPE html>S
        <html lang="en">
        
        <head>
            <title>BusBookingConfirmationMail</title>
        </head>
        <body>
            <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                transition: 0.3s;
                width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
                <div class="main" style="background-image: url('');">
                    <div class="main-container" style="text-align: center;">
                        <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                        <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                            style="width: 30%;" alt="logo">
        
                        <div style="width: 90%;margin: auto; text-align: left;">
                            <br><br>
                            <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                                Your Flight Booking successfully from skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    const email = to.email;
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: email,
      subject: "Bus Booking Confirmation Mail",
      html: html,
      attachments: [{ filename: "bus_booking.pdf", path: pdfFilePath }],
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },


  //upload image on cloudinary***************************************
  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
    return result.secure_url;
  },


  //===============================================================================================
  //===================== Send Email For Admin ====================================================
  //===============================================================================================

  // Send mail for hotel booking cencel Request user to admin ////////////////////

  hotelBookingCencelRequestForAdmin: async (to) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Hotel Booking Cancellation Request",
      text: to.message,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  },

  // Send mail for flight Booking cencel Request user to admin =========

  flightBookingCencelRequestForAdmin: async (to) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Flight Booking Cancellation Request",
      text: to.message,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });
       // Send the email
       const info = await transporter.sendMail(mailOptions);
       console.log("Email sent: " + info.response);
       return info;
     } catch (error) {
       console.error("Email sending failed:", error);
       throw error;
     }
   },



  sendHotelBookingCancelation: async (to, hotelName) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
    </head>
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                    <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                        style="width: 30%;" alt="logo">
    
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <br><br>
                        <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
                            your hotel booking of hotel ${hotelName} is canceled successfully from skyTrails.
                            You get your refund with in 7 days as per our policy. 
                    </div>
                </div>
    
            </div>
        </div>
    
    </body>
    </html>`;
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
    var mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: to.email,
      subject: "Hotel Booking Confirmation",
      html: html,
    };
    try {
      // Verify the connection
      transporter.verify(function (error, success) {
        if (error) {
          console.log("SMTP Connection Error: " + error);
        } else {
          console.log("SMTP Connection Success: " + success);
        }
      });


      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }

  },

  sendVerificationMail:async(to,otp)=> {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Reset Password</title>
    </head>
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                    <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                        style="width: 30%;" alt="logo">
    
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <br><br>
                        <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
                            ${otp} is your OTP for verify and reset your password.
                    </div>
                </div>
    
            </div>
        </div>
    
    </body>
    </html>`;
var transporter = nodemailerConfig.createTransport({
  service: nodemailerConfig.service,
  auth: {
    user: nodemailerConfig.user,
    pass: nodemailerConfig.pass,
  },
});
var mailOptions = {
  from: nodemailerConfig.user,
  to: to,
  subject: "Reset Password",
  html: html,
};
return await transporter.sendMail(mailOptions);
  },

  sendEmailOtp: async (email, otp) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
    </head>
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
                    <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                        style="width: 30%;" alt="logo">
    
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <br><br>
                        <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear User,
                        Use the One Time Password(OTP) ${otp} to verify your accoount.
                    </div>
                </div>
    
            </div>
        </div>
    
    </body>
    </html>`;
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": config.get('nodemailer.email'),
        "pass": config.get('nodemailer.password')

      }
    });
    var mailOptions = {
      from: config.get('nodemailer.email'),
      to: email,
      subject: 'Otp for verication',
      html: html,
    };
    return await transporter.sendMail(mailOptions)
  },

};