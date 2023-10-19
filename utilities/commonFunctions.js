const nodemailerConfig = require('../config/nodeConfig');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


module.exports = {

    getOTP() {
        var otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
    },

    getToken: async (payload) => {
        var token = await jwt.sign(payload, config.get('jwtsecret'), { expiresIn: "24h" })
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
        </html>`
        var transporter = nodemailerConfig.createTransport({
            service: nodemailerConfig.service,
            auth: {
                "user": nodemailerConfig.user,
                "pass": nodemailerConfig.pass

            },

        });
        var mailOptions = {
            from: nodemailerConfig.user,
            to: to,
            subject: 'Verification Mail',
            html: html
        };
        return await transporter.sendMail(mailOptions)
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
        </html>`
        var transporter = nodemailerConfig.createTransport({
            service: nodemailerConfig.service,
            auth: {
                "user": nodemailerConfig.user,
                "pass": nodemailerConfig.pass

            },

        });
        var mailOptions = {
            from: nodemailerConfig.user,
            to: to,
            subject: 'Verification Mail',
            html: html
        };
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    },


    sendHotelBookingConfirmation: async (to) => {
        console.log("to=======", to);
        console.log("to=======", to);
        console.log("nodemailerConfig.options.auth.user =", nodemailerConfig.options.auth.user);
        console.log("nodemailerConfig.options.auth.pass =", nodemailerConfig.options.auth.pass);
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
                                you are booked hotel successfully from skyTrails.
                        </div>
                    </div>
        
                </div>
            </div>
        
        </body>
        </html>`
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                "user": nodemailerConfig.options.auth.user,
                "pass": nodemailerConfig.options.auth.pass

            },
        });
        var mailOptions = {
            from: nodemailerConfig.options.auth.user,
            to: to.email,
            subject: 'Hotel Booking Confirmation',
            html: html
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
            console.log('Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }


    },

    sendBusBookingConfirmation: async (to) => {
        console.log("to=======", to);
        console.log("to=======", to);
        console.log("nodemailerConfig.options.auth.user =", nodemailerConfig.options.auth.user);
        console.log("nodemailerConfig.options.auth.pass =", nodemailerConfig.options.auth.pass);
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
        </html>`
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                "user": nodemailerConfig.options.auth.user,
                "pass": nodemailerConfig.options.auth.pass

            },
        });
        var mailOptions = {
            from: nodemailerConfig.options.auth.user,
            to: to.email,
            subject: 'Hotel Booking Confirmation',
            html: html
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
            console.log('Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.error('Email sending failed:', error);
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

}