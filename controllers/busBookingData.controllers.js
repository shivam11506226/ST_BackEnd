const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const busBookingData = require("../model/busBookingData.model");
const commonFunction = require("../utilities/commonFunctions");
const bookingStatus = require("../enums/bookingStatus");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const sendSMS = require("../utilities/sendSms");
const whatsAppMsg = require("../utilities/whatsApi");
exports.addBusBookingData = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      destination: req.body.destination,
      origin: req.body.origin,
      dateOfJourney: req.body.dateOfJourney,
      busType: req.body.busType,
      pnr: req.body.pnr,
      busId: req.body.busId,
      noOfSeats: req.body.noOfSeats,
      amount:req.body.amount,
      bookingStatus:"BOOKED",
    };
    const response = await busBookingData.create(data);
    // console.log(response.bookingStatus,"status")

    const msg = "Bus booking details added successfully";
    if(response.bookingStatus === "BOOKED"){
      const message = `Hello ${data.name} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:. Or You Can login theskytrails.com/login,`
      await sendSMS.sendSMSBusBookingAgent(response);
      await whatsAppMsg.sendWhatsAppMessage(data.phone, message);
      await commonFunction.BusBookingConfirmationMail(data);
    

    }
    
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//======================================================================
//======== Get All Bus Booking list For admin  =========================
//======================================================================

exports.getAllBusBookingdataForAdmin = async (req, res) => {
  try {
    const { Status } = req.body;
    let response;
    if (Status === bookingStatus.BOOKED) {
      response = await busBookingData.find({
        bookingStatus: bookingStatus.BOOKED,
      });
    } else if (Status === bookingStatus.PENDING) {
      response = await busBookingData.find({
        bookingStatus: bookingStatus.PENDING,
      });
    } else if (Status === bookingStatus.CANCEL) {
      response = await busBookingData.find({
        bookingStatus: bookingStatus.CANCEL,
      });
    } else {
      response = await busBookingData.find({});
      const msg = "successfully get all Bus bookings";
      actionCompleteResponse(res, response, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
