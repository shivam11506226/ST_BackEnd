const nodemailerConfig = require("../config/nodeConfig");
const { PDFDocument, rgb } = require('pdf-lib');
const puppeteer = require('puppeteer');
const fs = require('fs');
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

function getHtmlContent(name) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Booking Mail</title>
    </head>
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
                        style="width: 30%;" alt="logo">
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <br><br>
                        <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${name},
                            Your Booking successfully from skyTrails.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}


module.exports = {
  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },

  getToken: async (payload) => {
    var token = await jwt.sign(payload, config.secret, { expiresIn: '1y' });
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

  // sendHotelBookingConfirmation: async (to) => {
  //   let html = `<!DOCTYPE html>
  //       <html lang="en">
        
  //       <head>
  //           <title></title>
  //       </head>
  //       <body>
  //           <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  //               transition: 0.3s;
  //               width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
  //               <div class="main" style="background-image: url('');">
  //                   <div class="main-container" style="text-align: center;">
  //                       <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
  //                       <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
  //                           style="width: 30%;" alt="logo">
        
  //                       <div style="width: 90%;margin: auto; text-align: left;">
  //                           <br><br>
  //                           <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${to.name},
  //                               you are booked hotel successfully from skyTrails.<br>Yor details is:=== <br>hotelName:${to.hotelName}<br>CheckInDate:${to.CheckInDate}<br>CheckOutDate:${to.CheckOutDate}<br>noOfPeople: ${to.noOfPeople}<br>night: ${to.night}<br>room:${to.room}<br>
  //                       </div>
  //                   </div>
        
  //               </div>
  //           </div>
        
  //       </body>
  //       </html>`;
  //   var transporter = nodemailer.createTransport({
  //     host: "smtp.gmail.com",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: nodemailerConfig.options.auth.user,
  //       pass: nodemailerConfig.options.auth.pass,
  //     },
  //   });
  //   var mailOptions = {
  //     from: nodemailerConfig.options.auth.user,
  //     to: to.email,
  //     subject: "Hotel Booking Confirmation",
  //     html: html,
  //   };
  //   try {
  //     // Verify the connection
  //     transporter.verify(function (error, success) {
  //       if (error) {
  //         console.log("SMTP Connection Error: " + error);
  //       } else {
  //         console.log("SMTP Connection Success: " + success);
  //       }
  //     });

  //     // Send the email
  //     const info = await transporter.sendMail(mailOptions);
  //     console.log("Email sent: " + info.response);
  //     return info;
  //   } catch (error) {
  //     console.error("Email sending failed:", error);
  //     throw error;
  //   }
  // },

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
  //========== Send Email Flight Booking Confirmation Mail with pdf=======
  //==========================================================


  FlightBookingConfirmationMail: async (to) => {
    
  
      const name = `${to?.passengerDetails[0]?.firstName} ${to?.passengerDetails[0]?.lastName}`;

      // Define your HTML content with nested elements
      const htmlContent = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>pdf layout</title>
        </head>
        <body
          style="margin: 0; padding: 0; box-sizing: border-box; background: #f4f3f3"
        >
          <div style="width: 80vw; margin: 5% 10%">
            <div
              style="
                justify-content: space-between;
                align-items: center;
                display: flex;
                height: 156px;
              "
            >
              <img
                src="https://travvolt.s3.amazonaws.com/ST-Main-Logo.png"
                alt="logo"
                style="height: 100%"
              />
              <div
                style="
                  color: black;
                  font-size: 24px;
                  font-family: Montserrat;
                  font-weight: 600;
                  word-wrap: break-word;
                "
              >
                Booking Voucher
              </div>
              <div
                style="
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;
                  display: flex;
                "
              >
                <div
                  style="
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: #868686;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    Booking Id:
                  </div>
                  <div
                    style="
                      color: #071c2c;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    NH72050289874804
                  </div>
                </div>
                <div
                  style="
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: #868686;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    PNR:
                  </div>
                  <div
                    style="
                      color: #071c2c;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    B987XKH89SCH
                  </div>
                </div>
                <div
                  style="
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: #868686;
                      font-size: 12px;
                      font-family: Montserrat;
                      font-weight: 500;
                      word-wrap: break-word;
                    "
                  >
                    (Booked on 04 Nov 2023)
                  </div>
                </div>
              </div>
            </div>
            <div
              style="
                background: white;
                padding: 24px;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                border-radius: 12px;
                height: 700px;
              "
            >
              <!-- <div style="display: flex; justify-content: space-between">
                <div>
                  <div
                    style="
                      color: black;
                      font-size: 20px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    "
                  >
                    Pullaman Hotel
                  </div>
                </div>
                <div>
                  <h2
                    style="
                      color: #e73c33;
                      font-size: 24px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    "
                  >
                    CONFIRM
                  </h2>
                  <p>THANK YOU</p>
                </div>
              </div> -->
             
              <!--  -->
              <div style="width: 100%; height: 53px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                  <div style="color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Pullaman Hotel</div>
                  <div style="height: 24px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                  </div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-end; display: inline-flex">
                  <div style="color: #E73C33; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">CONFIRMED </div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">THANK YOU</div>
                </div>
              </div>
      
      
              <div style="width: 100%; height: 84px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 12px; display: inline-flex">
                <div style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">347/1-B, Chapora Fort Road, New Delhi, IN</div>
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 15px; height: 15px; left: 2.50px; top: 2.50px; position: absolute; background: #21325D"></div>
                  </div>
                  <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">98173678181, 8912731729</div>
                </div>
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #21325D"></div>
                    <div style="width: 16.67px; height: 13.33px; left: 1.67px; top: 3.33px; position: absolute; background: #21325D"></div>
                  </div>
                  <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">HB374-RE@Skytrails.com</div>
                </div>
              </div>
             
      
              <!--  -->
              
              <div style="width: 100%; height: 428.67px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 36px; display: inline-flex">
                <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
                <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                    <div style="width: 20px; height: 20px; justify-content: center; align-items: center; gap: 10px; display: flex">
                      <div style="flex: 1 1 0; align-self: stretch"></div>
                      <div style="width: 15px; height: 16.67px; left: 2.50px; top: 1.66px; position: absolute; background: #E73C33"></div>
                    </div>
                    <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">5-Nights Stay</div>
                  </div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-in</div>
                    <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Sat, 18 Nov </span><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2023</span></div>
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">After 03:00 PM</div>
                  </div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-out</div>
                    <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Thu, 23 Nov </span><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2023</span></div>
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Before 12:00 PM</div>
                  </div>
                </div>
                <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
                <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: center; gap: 120px; display: inline-flex">
                  <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
                    <div style="width: 20px; height: 20px; position: relative">
                      <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                      <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #E73C33"></div>
                    </div>
                    <div><span style="color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2 Guests<br/></span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(2 Adults)</span></div>
                  </div>
                  <div style="align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; gap: 20px; display: inline-flex">
                    <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Ms. Archana Kumari </span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(Primary Guest)</span></div>
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">archana071996@gmail.com, 9180183212</div>
                  </div>
                </div>
                <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 136px; display: inline-flex">
                  <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                    <div style="width: 20px; height: 20px; position: relative">
                      <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 16.67px; height: 11.67px; left: 1.67px; top: 4.17px; position: absolute; background: #E73C33"></div>
                    </div>
                    <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">1 Room</div>
                  </div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                    <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
                    <div style="justify-content: center; align-items: center; gap: 8px; display: inline-flex">
                      <div style="width: 20px; height: 20px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 58px; display: inline-flex">
                        <div style="justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
                          <div style="width: 12px; height: 16px; left: 6px; top: 4px; position: absolute; background: #071C2C"></div>
                        </div>
                      </div>
                      <div style="text-align: center; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Restaurant</div>
                    </div>
                    <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                      <div style="width: 20px; height: 20px; position: relative">
                        <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                        <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2 Adults</div>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
            <div style="width: 100%; margin-top: 5px; height: 200px; padding-top: 24px; padding-bottom: 24px; background: white; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 12px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
              <div style="align-self: stretch; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="flex-direction: column; justify-content: flex-start;  padding-left: 28px; padding-right: 28px; align-items: flex-start; gap: 12px; display: inline-flex">
                  <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Pullman Hotel New Delhi</div>
                  <div style="justify-content: center; align-items: center; gap: 24px; display: inline-flex">
                    <div style="width: 120px; justify-content: flex-start; align-items: flex-start; display: flex">
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                      <div style="width: 24px; height: 24px; position: relative">
                        <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                        <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                      </div>
                    </div>
                    <div style="padding: 4px; border-radius: 4px; border: 2px #E73C33 solid; justify-content: center; align-items: center; gap: 10px; display: flex">
                      <div style="color: #071C2C; font-size: 8px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Couple Friendly</div>
                    </div>
                  </div>
                </div>
                <img style="width: 247px; height: 117px; background: linear-gradient(0deg, #D9D9D9 0%, #D9D9D9 100%); border-radius: 8px" src="https://via.placeholder.com/247x117" />
              </div>
              <div style="align-self: stretch; padding-left: 28px; padding-right: 28px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                <div style="flex: 1 1 0; color: #BBBBBB; font-size: 12px; font-family: Montserrat; font-weight: 700; letter-spacing: 0.48px; word-wrap: break-word">Sat, 18 Nov 2023 - Thu, 23 Nov 2023 | 1 Room | 2 Adults (Ms. Archana Kumari +1)</div>
              </div>
            </div>
      
            <div style="width: 100%; margin-top: 5px; height: 422px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Room Type & Amenities </div>
              <div style="height: 369px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
                <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 12.50px; height: 16.67px; left: 3.33px; top: 1.66px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Breakfast</div>
                </div>
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 22px; height: 16px; left: 1px; top: 4px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2 Guests</div>
                </div>
                <div style="align-self: stretch; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">TV, Telephone, Centre Table, Bathroom, Chair, Seating Area, Cupboards with Locks, Hot & Cold Water, Dining Table, Sofa, Blackout Curtains, Blanket, Electronic Safe, Living Area, Room Service, Western Toilet Seat, Bidet, Housekeeping, Dining Area, Shaving Mirror, Toiletries, Mineral Water, Wi-Fi, Bathroom Phone, Balcony, Hairdryer, Geyser/Water Heater, Shower Cap, Mini Fridge, Kettle, Air Conditioning, Dental Kit, Charging Points, Slippers, In-room Dining.</div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                  <div style="text-align: center; color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">INCLUSIONS</div>
                  <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                    <div style="justify-content: flex-start; align-items: center; gap: 21px; display: inline-flex">
                      <div style="width: 472px; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">All transfers on private basis to airport and sightseeing places.</div>
                    </div>
                    <div style="justify-content: flex-start; align-items: flex-start; gap: 21px; display: inline-flex">
                      <div style="color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Tickets to Miracle Garden</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
            <!-- cancel refund policy start -->
      
            <div style="width: 100%; height: 100px; margin-top: 5px; background: white; box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.25); border-radius: 12px; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
              <div style="align-self: stretch; height: 20px; padding-left: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 26px; display: flex">
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C;  font-size: 16px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Cancellation Refund Policy</div>
                </div>
              </div>
              <div style="align-self: stretch; padding-left: 24px; color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word"> Free Cancellation (100% refund) till Sat, 18 Nov 2023, 10:59 AM.</div>
             
            </div>
      
            <!-- cancel refund policy end -->
      
            <!-- fare break-down start-->
      
            <div style="width: 100%; margin-top: 5px; height: 329px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px #868686 solid; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
                <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Booking Price Break-up</div>
              </div>
              <div style="flex-direction: column; width: 100%; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px;  justify-content: flex-start; align-items: flex-start; gap: 64px; display: inline-flex">
                  <div style="width: 100%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Accommodation charges collected on behalf of hotel (incl. applicable hotel taxes)</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 33,629</div>
                </div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Skytrails Service Fee</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 254</div>
                </div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">HR-SGST @ 9%</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
                </div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">CGST @ 9%</div>
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
                </div>
                <div style="align-self: stretch; height: 0px; border: 1px #868686 solid"></div>
                <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                  <div style="width: 80%; color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">TOTAL</div>
                  <div style="color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 33,929</div>
                </div>
              </div>
            </div>
      
      
            <!-- fare break-down end -->
      
            <!-- hotel Amenities start-->
      
            <div style="width: 100%; margin-top: 5px; height: 693px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Hotel Amenities</div>
              <div style="align-self: stretch; height: 640px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Common Area</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Lounge, Lawn, Reception, Library, Seating Area, Outdoor Furniture</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Outdoor Activities and Sports</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Water Sports, Outdoor Sports</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Business Center and Conferences</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Business Centre, Conference Room, Banquet</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Common Area</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Lounge, Lawn, Reception, Library, Seating Area, Outdoor Furniture</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Outdoor Activities and Sports</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Water Sports, Outdoor Sports</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Business Center and Conferences</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Business Centre, Conference Room, Banquet</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Common Area</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Lounge, Lawn, Reception, Library, Seating Area, Outdoor Furniture</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Business Center and Conferences</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Business Centre, Conference Room, Banquet</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Outdoor Activities and Sports</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Water Sports, Outdoor Sports</div>
                </div>
              </div>
            </div>
      
      
            <!-- hotel amenities end -->
      
            <!-- hotel rule start -->
      
      
            <div style="width: 100%; height: 300px; margin-top: 5px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Rules & Policies</div>
              <div style="align-self: stretch; height: 812px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Food Arrangement</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Non veg food is allowed<br/>Food delivery service is not available at the property<br/>Outside food is not allowed</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                  <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Smoking/alcohol Consumption Rules</div>
                  <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">There are no restrictions on alcohol consumption.<br/>Smoking within the premises is not allowed</div>
                </div>
              </div>
            </div>
      
      
      
            <!-- hotel rule end -->
      
      
            <div
              style="
                padding-left: 28px;
                margin-top: 5px;
                padding-right: 28px;
                padding-top: 24px;
                padding-bottom: 24px;
                background: white;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                border-radius: 12px;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 24px;
                display: flex;
              "
            >
              <div
                style="
                  color: #e73c33;
                  font-size: 20px;
                  font-family: Montserrat;
                  font-weight: 700;
                  word-wrap: break-word;
                "
              >
                The Skytrails Support
              </div>
              <div
                style="
                  width: 456px;
                  height: 48px;
                  justify-content: flex-start;
                  align-items: center;
                  gap: 40px;
                  display: inline-flex;
                "
              >
                <div
                  style="
                    padding: 12px;
                    background: #e73c33;
                    border-radius: 12px;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    display: flex;
                  "
                >
                  <div
                    style="
                      color: white;
                      font-size: 20px;
                      font-family: Montserrat;
                      font-weight: 700;
                      word-wrap: break-word;
                    "
                  >
                    +91 8917972301
                  </div>
                </div>
                <div
                  style="
                    justify-content: flex-start;
                    align-items: flex-start;
                    gap: 8px;
                    display: flex;
                  "
                >
                  <div style="width: 20px; height: 20px; position: relative">
                    <div
                      style="
                        width: 20px;
                        height: 20px;
                        left: 0px;
                        top: 0px;
                        position: absolute;
                        background: #21325d;
                      "
                    ></div>
                    <div
                      style="
                        width: 16.67px;
                        height: 13.33px;
                        left: 1.67px;
                        top: 3.33px;
                        position: absolute;
                        background: #e73c33;
                      "
                    ></div>
                  </div>
                  <div
                    style="
                      color: #e73c33;
                      font-size: 16px;
                      font-family: Montserrat;
                      font-weight: 600;
                      word-wrap: break-word;
                    "
                  >
                    HB374-RE@Skytrails.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
      `;

      // Create a new PDF document
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Save the PDF to a temporary file
      await page.setContent(htmlContent);
  
      const pdfFilePath = 'flightbooking.pdf';
      
     const pdfBytes= await page.pdf({ path: pdfFilePath, format: 'A4' });
      await browser.close();
      // const pdfBytes= await pdf.saveAs(pdfFilePath);

      console.log("PDF generation complete.");
        
    fs.writeFileSync(pdfFilePath, pdfBytes);

      // Use pdfFilePath in the email sending part of your code
      // ...

    
 

  
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: nodemailerConfig.options.auth.user,
        pass: nodemailerConfig.options.auth.pass,
      },
    });
  
    const passengerEmail = to.passengerDetails[0].email;
  
    const mailOptions = {
      from: nodemailerConfig.options.auth.user,
      to: passengerEmail,
      subject: 'Flight Booking Confirmation Mail',
      html: getHtmlContent(name),
      attachments: [{ filename: 'flightBooking.pdf', path: pdfFilePath }],
    };
  
    try {
      // Verify the connection
      await transporter.verify();
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
  
      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);
  
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  
    
  },

  // FlightBookingConfirmationMail: async (to) => {
    
  //   const name=`${to?.passengerDetails[0]?.firstName} ${to?.passengerDetails[0]?.lastName}`
  //   const pdfDoc = await PDFDocument.create();
  //   const page = pdfDoc.addPage([600, 400]);
  //   const content = `
  //     First Name: ${to.passengerDetails[0].firstName}
  //     Last Name: ${to.passengerDetails[0].lastName}
  //     Gender: ${to.passengerDetails[0].gender}
  //     Phone: ${to.passengerDetails[0].ContactNo}
  //     Date of Birth: ${to.passengerDetails[0].DateOfBirth}
  //     Email: ${to.passengerDetails[0].email}
  //     Address: ${to.passengerDetails[0].addressLine1}
  //     City: ${to.passengerDetails[0].city}
  //     PNR: ${to.pnr}
  //   `;
  
  //   page.drawText(content, {
  //     x: 50,
  //     y: 350,
  //     size: 12,
  //     color: rgb(0, 0, 0),
  //   });
  
  //   // Serialize the PDF to bytes
  //   const pdfBytes = await pdfDoc.save();
  
  //   // Write the PDF to a temporary file
  //   const pdfFilePath = 'temp_api_data.pdf';
  //   fs.writeFileSync(pdfFilePath, pdfBytes);
  
  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.gmail.com',
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: nodemailerConfig.options.auth.user,
  //       pass: nodemailerConfig.options.auth.pass,
  //     },
  //   });
  
  //   const passengerEmail = to.passengerDetails[0].email;
  
  //   const mailOptions = {
  //     from: nodemailerConfig.options.auth.user,
  //     to: passengerEmail,
  //     subject: 'Flight Booking Confirmation Mail',
  //     html: getHtmlContent(name),
  //     attachments: [{ filename: 'api_data.pdf', path: pdfFilePath }],
  //   };
  
  //   try {
  //     // Verify the connection
  //     await transporter.verify();
  
  //     // Send the email
  //     const info = await transporter.sendMail(mailOptions);
  //     console.log('Email sent: ' + info.response);
  
  //     // Clean up the temporary PDF file
  //     fs.unlinkSync(pdfFilePath);
  
  //     return info;
  //   } catch (error) {
  //     console.error('Email sending failed:', error);
  //     throw error;
  //   }
  
  //   // let html = `<!DOCTYPE html>
  //   //     <html lang="en">
        
  //   //     <head>
  //   //         <title>FlightApplyConfirmationMail</title>
  //   //     </head>
  //   //     <body>
  //   //         <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  //   //             transition: 0.3s;
  //   //             width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
  //   //             <div class="main" style="background-image: url('');">
  //   //                 <div class="main-container" style="text-align: center;">
  //   //                     <!-- <h1 style="padding-top: 30px;"> <strong> GFMI </strong></h1> -->
  //   //                     <img src="https://res.cloudinary.com/nandkishor/image/upload/v1676882752/Group_1171275777_gge2f0.png"
  //   //                         style="width: 30%;" alt="logo">
        
  //   //                     <div style="width: 90%;margin: auto; text-align: left;">
  //   //                         <br><br>
  //   //                         <p style="color: #333030;font-size: 18px;margin-top: 0px;"> Dear ${name},
  //   //                             Your Flight Booking successfully from skyTrails.
  //   //                     </div>
  //   //                 </div>
        
  //   //             </div>
  //   //         </div>
        
  //   //     </body>
  //   //     </html>`;
  //   // var transporter = nodemailer.createTransport({
  //   //   host: "smtp.gmail.com",
  //   //   port: 587,
  //   //   secure: false,
  //   //   auth: {
  //   //     user: nodemailerConfig.options.auth.user,
  //   //     pass: nodemailerConfig.options.auth.pass,
  //   //   },
  //   // });
  //   // const passengerEmail = to.passengerDetails[0].email;
  //   // var mailOptions = {
  //   //   from: nodemailerConfig.options.auth.user,
  //   //   to: passengerEmail,
  //   //   subject: "Flight Booking Confirmation Mail",
  //   //   html: html,
  //   //   attachments: [{ filename: "api_data.pdf", path: pdfFilePath }],
  //   // };
  //   // try {
  //   //   // Verify the connection
  //   //   transporter.verify(function (error, success) {
  //   //     if (error) {
  //   //       console.log("SMTP Connection Error: " + error);
  //   //     } else {
  //   //       console.log("SMTP Connection Success: " + success);
  //   //     }
  //   //   });

  //   //   // Send the email
  //   //   const info = await transporter.sendMail(mailOptions);
  //   //   console.log("Email sent: " + info.response);
  //   //   return info;
  //   // } catch (error) {
  //   //   console.error("Email sending failed:", error);
  //   //   throw error;
  //   // }
  // },

   //==========================================================
  //========== Send Email Bus Booking Confirmation Mail with pdf=======
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
                                Your Bus Booking successfully from skyTrails.
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

  
  //==========================================================
  //========== Send Email Hotel Booking Confirmation Mail with pdf=======
  //==========================================================


 HotelBookingConfirmationMail: async (to) => {

  const currentDate = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  
  const noOfNights = () => { 
    const checkInDateOld = new Date(to.CheckInDate);
    const checkOutDateOld = new Date(to.CheckOutDate);
  
    // console.log("Parsed Check-in Date:", CheckInDate);
    // console.log("Parsed Check-out Date:", CheckOutDate);
  
    // Calculate the difference in milliseconds between the two dates
    const timeDifference = checkOutDateOld.getTime() - checkInDateOld.getTime();
  
    // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    return timeDifference / (1000 * 60 * 60 * 24);
  }

  const checkInDate=()=>{
    const date = new Date(to.CheckInDate);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }
 //Check Out Date formate
  const checkOutDate=()=>{
    const date = new Date(to.CheckOutDate);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }
  

 



// console.log("Number of nights:", noOfNights);
// console.log(formattedDate);


    let htmlContent = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hotel booking pdf</title>
      </head>
      <body
        style="margin: 0; padding: 0; box-sizing: border-box; background: #f4f3f3"
      >
        <div style="width: 80vw; margin: 5% 10%">
          <div
            style="
              justify-content: space-between;
              align-items: center;
              display: flex;
              height: 156px;
            "
          >
            <img
              src="https://travvolt.s3.amazonaws.com/ST-Main-Logo.png"
              alt="logo"
              style="height: 100%"
            />
            <div
              style="
                color: black;
                font-size: 24px;
                font-family: Montserrat;
                font-weight: 600;
                word-wrap: break-word;
              "
            >
              Booking Voucher
            </div>
            <div
              style="
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 8px;
                display: flex;
              "
            >
              <div
                style="
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: #868686;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  Booking Id:
                </div>
                <div
                  style="
                    color: #071c2c;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  ${to.bookingId}
                </div>
              </div>
              <div
                style="
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: #868686;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  PNR:
                </div>
                <div
                  style="
                    color: #071c2c;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  ${to.bookingId}
                </div>
              </div>
              <div
                style="
                  justify-content: center;
                  align-items: center;
                  gap: 4px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: #868686;
                    font-size: 12px;
                    font-family: Montserrat;
                    font-weight: 500;
                    word-wrap: break-word;
                  "
                >
                  (Booked on ${formattedDate})
                </div>
              </div>
            </div>
          </div>
          <div
            style="
              background: white;
              padding: 24px;
              box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
              border-radius: 12px;
              height: 700px;
            "
          >
            <!-- <div style="display: flex; justify-content: space-between">
              <div>
                <div
                  style="
                    color: black;
                    font-size: 20px;
                    font-family: Montserrat;
                    font-weight: 600;
                    word-wrap: break-word;
                  "
                >
                  ${to.hotelName}
                </div>
              </div>
              <div>
                <h2
                  style="
                    color: #e73c33;
                    font-size: 24px;
                    font-family: Montserrat;
                    font-weight: 600;
                    word-wrap: break-word;
                  "
                >
                  CONFIRM
                </h2>
                <p>THANK YOU</p>
              </div>
            </div> -->
           
            <!--  -->
            <div style="width: 100%; height: 53px; justify-content: space-between; align-items: flex-start; display: inline-flex">
              <div style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; display: inline-flex">
                <div style="color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${to.hotelName}</div>
                <div style="height: 24px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                  <div style="width: 24px; height: 24px; position: relative">
                    <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                  </div>
                </div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-end; display: inline-flex">
                <div style="color: #E73C33; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">CONFIRMED </div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">THANK YOU</div>
              </div>
            </div>
    
    
            <div style="width: 100%; height: 84px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 12px; display: inline-flex">
              <div style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${to.address}</div>
              <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                  <div style="width: 15px; height: 15px; left: 2.50px; top: 2.50px; position: absolute; background: #21325D"></div>
                </div>
                <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">98173678181, 8912731729</div>
              </div>
              <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #21325D"></div>
                  <div style="width: 16.67px; height: 13.33px; left: 1.67px; top: 3.33px; position: absolute; background: #21325D"></div>
                </div>
                <div style="color: #21325D; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">HB374-RE@Skytrails.com</div>
              </div>
            </div>
           
    
            <!--  -->
            
            <div style="width: 100%; height: 428.67px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; flex-direction: column; justify-content: center; align-items: flex-start; gap: 36px; display: inline-flex">
              <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
              <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                  <div style="width: 20px; height: 20px; justify-content: center; align-items: center; gap: 10px; display: flex">
                    <div style="flex: 1 1 0; align-self: stretch"></div>
                    <div style="width: 15px; height: 16.67px; left: 2.50px; top: 1.66px; position: absolute; background: #E73C33"></div>
                  </div>
                  <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${noOfNights()}-Nights Stay</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-in</div>
                  <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${checkInDate()}</span></div>
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">After 03:00 PM</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: inline-flex">
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Check-out</div>
                  <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${checkOutDate()} </span></div>
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Before 12:00 PM</div>
                </div>
              </div>
              <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
              <div style="align-self: stretch; height: 66.33px; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: center; gap: 120px; display: inline-flex">
                <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                    <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #E73C33"></div>
                  </div>
                  <div><span style="color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${to.noOfPeople} Guests<br/></span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(${to.noOfPeople} Adults)</span></div>
                </div>
                <div style="align-self: stretch; flex-direction: column; justify-content: center; align-items: flex-start; gap: 20px; display: inline-flex">
                  <div style="text-align: center"><span style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${to.name} </span><span style="color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">(Primary Guest)</span></div>
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${to.email}, ${to.phone}</div>
                </div>
              </div>
              <div style="align-self: stretch; height: 0px; border: 1px black solid"></div>
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 136px; display: inline-flex">
                <div style="justify-content: center; align-items: center; gap: 8px; display: flex">
                  <div style="width: 20px; height: 20px; position: relative">
                    <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                    <div style="width: 16.67px; height: 11.67px; left: 1.67px; top: 4.17px; position: absolute; background: #E73C33"></div>
                  </div>
                  <div style="text-align: center; color: #E73C33; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${to.room} Room</div>
                </div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                  <div style="text-align: center; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
                  <div style="justify-content: center; align-items: center; gap: 8px; display: inline-flex">
                    <div style="width: 20px; height: 20px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 58px; display: inline-flex">
                      <div style="justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
                        <div style="width: 12px; height: 16px; left: 6px; top: 4px; position: absolute; background: #071C2C"></div>
                      </div>
                    </div>
                    <div style="text-align: center; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Restaurant</div>
                  </div>
                  <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                    <div style="width: 20px; height: 20px; position: relative">
                      <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                      <div style="width: 18.33px; height: 13.33px; left: 0.83px; top: 3.33px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">${to.noOfPeople} Adults</div>
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
          <div style="width: 100%; margin-top: 5px; height: 200px; padding-top: 24px; padding-bottom: 24px; background: white; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); border-radius: 12px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
            <div style="align-self: stretch; justify-content: space-between; align-items: flex-start; display: inline-flex">
              <div style="flex-direction: column; justify-content: flex-start;  padding-left: 28px; padding-right: 28px; align-items: flex-start; gap: 12px; display: inline-flex">
                <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">${to.hotelName}</div>
                <div style="justify-content: center; align-items: center; gap: 24px; display: inline-flex">
                  <div style="width: 120px; justify-content: flex-start; align-items: flex-start; display: flex">
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                    <div style="width: 24px; height: 24px; position: relative">
                      <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #071C2C"></div>
                      <div style="width: 20px; height: 19px; left: 2px; top: 3px; position: absolute; background: #071C2C"></div>
                    </div>
                  </div>
                  <div style="padding: 4px; border-radius: 4px; border: 2px #E73C33 solid; justify-content: center; align-items: center; gap: 10px; display: flex">
                    <div style="color: #071C2C; font-size: 8px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Couple Friendly</div>
                  </div>
                </div>
              </div>
              <img style="width: 247px; height: 117px; background: linear-gradient(0deg, #D9D9D9 0%, #D9D9D9 100%); border-radius: 8px" src="https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/room-imgs/201610072207462380-180447-1ba3a1c68aaf11e898ae0a9df65c8753.jpg" />
            </div>
            <div style="align-self: stretch; padding-left: 28px; padding-right: 28px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
              <div style="flex: 1 1 0; color: #BBBBBB; font-size: 12px; font-family: Montserrat; font-weight: 700; letter-spacing: 0.48px; word-wrap: break-word">${checkInDate()} - ${checkOutDate()} | ${to.room} Room | ${to.noOfPeople} Adults (${to.name} + ${to.noOfPeople-1})</div>
            </div>
          </div>
    
          <div style="width: 100%; margin-top: 5px; height: 422px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
            <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Room Type & Amenities </div>
            <div style="height: 369px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: flex">
              <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Standard Room With 2 Single Beds</div>
              <div style="justify-content: flex-start; align-items: center; gap: 8px; display: inline-flex">
                <div style="width: 20px; height: 20px; position: relative">
                  <div style="width: 20px; height: 20px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                  <div style="width: 12.50px; height: 16.67px; left: 3.33px; top: 1.66px; position: absolute; background: #071C2C"></div>
                </div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Breakfast</div>
              </div>
              <div style="justify-content: flex-start; align-items: flex-start; gap: 8px; display: inline-flex">
                <div style="width: 24px; height: 24px; position: relative">
                  <div style="width: 24px; height: 24px; left: 0px; top: 0px; position: absolute; background: #D9D9D9"></div>
                  <div style="width: 22px; height: 16px; left: 1px; top: 4px; position: absolute; background: #071C2C"></div>
                </div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">2 Guests</div>
              </div>
              <div style="align-self: stretch; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">TV, Telephone, Centre Table, Bathroom, Chair, Seating Area, Cupboards with Locks, Hot & Cold Water, Dining Table, Sofa, Blackout Curtains, Blanket, Electronic Safe, Living Area, Room Service, Western Toilet Seat, Bidet, Housekeeping, Dining Area, Shaving Mirror, Toiletries, Mineral Water, Wi-Fi, Bathroom Phone, Balcony, Hairdryer, Geyser/Water Heater, Shower Cap, Mini Fridge, Kettle, Air Conditioning, Dental Kit, Charging Points, Slippers, In-room Dining.</div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                <div style="text-align: center; color: black; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">INCLUSIONS</div>
                <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
                  <div style="justify-content: flex-start; align-items: center; gap: 21px; display: inline-flex">
                    <div style="width: 472px; color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">All transfers on private basis to airport and sightseeing places.</div>
                  </div>
                  <div style="justify-content: flex-start; align-items: flex-start; gap: 21px; display: inline-flex">
                    <div style="color: #071C2C; font-size: 12px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Tickets to Miracle Garden</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <!-- cancel refund policy start -->
    
          <div style="width: 100%; height: 100px; margin-top: 5px; background: white; box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.25); border-radius: 12px; overflow: hidden; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
            <div style="align-self: stretch; height: 20px; padding-left: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 26px; display: flex">
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C;  font-size: 16px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Cancellation Refund Policy</div>
              </div>
            </div>
            <div style="align-self: stretch; padding-left: 24px; color: #868686; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word"> Free Cancellation (100% refund) Before ${checkInDate()}.</div>
           
          </div>
    
          <!-- cancel refund policy end -->
    
          <!-- fare break-down start-->
    
          <div style="width: 100%; margin-top: 5px; height: 150px; padding-top: 20px; padding-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px #868686 solid; flex-direction: column; justify-content: center; align-items: center; gap: 24px; display: inline-flex">
            <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: flex-start; align-items: flex-start; gap: 10px; display: inline-flex">
              <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Booking Price Break-up</div>
            </div>
            <div style="flex-direction: column; width: 100%; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px;  justify-content: flex-start; align-items: flex-start; gap: 64px; display: inline-flex">
                <div style="width: 100%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Accommodation charges collected on behalf of hotel (incl. applicable hotel taxes)</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR ${to.amount}</div>
              </div>
              <!--
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Skytrails Service Fee</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 254</div>
              </div>
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">HR-SGST @ 9%</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
              </div> 
              
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="width: 80%; color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">CGST @ 9%</div>
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR 23</div>
              </div>
              -->
              <div style="align-self: stretch; height: 0px; border: 1px #868686 solid"></div>
              <div style="align-self: stretch; padding-left: 20px; padding-right: 20px; justify-content: space-between; align-items: flex-start; display: inline-flex">
                <div style="width: 80%; color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">TOTAL</div>
                <div style="color: #E73C33; font-size: 20px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">INR ${to.amount}</div>
              </div>
            </div>
          </div>
    
    
          <!-- fare break-down end -->
    
          <!-- hotel Amenities start-->
    
          <div style="width: 100%; margin-top: 5px; height: 250px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
            <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Hotel Amenities</div>
            <div style="align-self: stretch; height: 640px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Common Area</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Lounge, Lawn, Reception, Library, Seating Area, Outdoor Furniture</div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Outdoor Activities and Sports</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Water Sports, Outdoor Sports</div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Business Center and Conferences</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Business Centre, Conference Room, Banquet</div>
              </div>
              
            </div>
          </div>
    
    
          <!-- hotel amenities end -->
    
          <!-- hotel rule start -->
    
    
          <div style="width: 100%; height: 300px; margin-top: 30px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
            <div style="color: #071C2C; font-size: 24px; font-family: Montserrat; font-weight: 700; word-wrap: break-word">Rules & Policies</div>
            <div style="align-self: stretch; height: 812px; padding: 24px; border-radius: 12px; border: 1px #868686 solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Food Arrangement</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">Non veg food is allowed<br/>Food delivery service is not available at the property<br/>Outside food is not allowed</div>
              </div>
              <div style="flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 4px; display: flex">
                <div style="color: #071C2C; font-size: 20px; font-family: Montserrat; font-weight: 600; word-wrap: break-word">Smoking/alcohol Consumption Rules</div>
                <div style="color: #071C2C; font-size: 16px; font-family: Montserrat; font-weight: 500; word-wrap: break-word">There are no restrictions on alcohol consumption.<br/>Smoking within the premises is not allowed</div>
              </div>
            </div>
          </div>
    
    
    
          <!-- hotel rule end -->
    
    
          <div
            style="
              padding-left: 28px;
              margin-top: 5px;
              padding-right: 28px;
              padding-top: 24px;
              padding-bottom: 24px;
              background: white;
              box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
              border-radius: 12px;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 24px;
              display: flex;
            "
          >
            <div
              style="
                color: #e73c33;
                font-size: 20px;
                font-family: Montserrat;
                font-weight: 700;
                word-wrap: break-word;
              "
            >
              The Skytrails Support
            </div>
            <div
              style="
                width: 456px;
                height: 48px;
                justify-content: flex-start;
                align-items: center;
                gap: 40px;
                display: inline-flex;
              "
            >
              <div
                style="
                  padding: 12px;
                  background: #e73c33;
                  border-radius: 12px;
                  justify-content: center;
                  align-items: center;
                  gap: 10px;
                  display: flex;
                "
              >
                <div
                  style="
                    color: white;
                    font-size: 20px;
                    font-family: Montserrat;
                    font-weight: 700;
                    word-wrap: break-word;
                  "
                >
                  +91 8917972301
                </div>
              </div>
              <div
                style="
                  justify-content: flex-start;
                  align-items: flex-start;
                  gap: 8px;
                  display: flex;
                "
              >
                <div style="width: 20px; height: 20px; position: relative">
                  <div
                    style="
                      width: 20px;
                      height: 20px;
                      left: 0px;
                      top: 0px;
                      position: absolute;
                      background: #21325d;
                    "
                  ></div>
                  <div
                    style="
                      width: 16.67px;
                      height: 13.33px;
                      left: 1.67px;
                      top: 3.33px;
                      position: absolute;
                      background: #e73c33;
                    "
                  ></div>
                </div>
                <div
                  style="
                    color: #e73c33;
                    font-size: 16px;
                    font-family: Montserrat;
                    font-weight: 600;
                    word-wrap: break-word;
                  "
                >
                  HB374-RE@Skytrails.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>`;

     // Create a new PDF document
     const browser = await puppeteer.launch();
     const page = await browser.newPage();

     // Save the PDF to a temporary file
     await page.setContent(htmlContent);
 
     const pdfFilePath = 'hotelBooking.pdf';
     
    const pdfBytes= await page.pdf({ path: pdfFilePath, format: 'A4', printBackground: true });
     await browser.close();
     // const pdfBytes= await pdf.saveAs(pdfFilePath);

     console.log("PDF generation complete.");
       
   fs.writeFileSync(pdfFilePath, pdfBytes);

    

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
      subject: "Hotel Booking Confirmation Mail",
      html: getHtmlContent(to.name),
      attachments: [{ filename: "hotel_booking.pdf", path: pdfFilePath }],
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
    console.log("result=============",result)
    return result.secure_url;
  },

uploadgetSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
    console.log("result=============",result)
    return result;
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