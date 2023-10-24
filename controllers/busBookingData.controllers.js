const busBookingData = require("../model/busBookingData.model");
const bookingStatus = require("../enums/bookingStatus");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

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
      bookingStatus: bookingStatus.BOOKED,
    };
    const response = await busBookingData.create(data);
    const msg = "Bus booking details added successfully";
    const sendMail = await commonFunction.sendBusBookingConfirmation(data);
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
