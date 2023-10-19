const hotelBookingModel = require("../model/hotelBooking.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const bookingStatus = require("../enums/bookingStatus");
const commonFunction = require("../utilities/commonFunctions");
const { log } = require("console");

exports.addHotelBookingData = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      destination: req.body.destination,
      BookingId: req.body.origin,
      CheckInDate: req.body.CheckInDate,
      CheckOutDate: req.body.CheckOutDate,
      hotelName: req.body.hotelName,
      hotelId: req.body.hotelId,
      noOfPeople: req.body.noOfPeople,
      cityName: req.body.cityName,
      country: req.body.country,
      room: req.body.room,
      night: req.body.night,
      bookingStatus: bookingStatus.BOOKED,
    };
    const response = await hotelBookingModel.create(data);
    console.log("response==========", response);
    const msg = "Hotel booking  successfully";
    const sendMail = await commonFunction.sendHotelBookingConfirmation(data);
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//=====================================================
//====== Get All Hotel booking List For Admin =========
//=====================================================

exports.getAllHotelBookingForAdmin = async (req, res) => {
    try {
        const { Status } = req.body;
        let response;
        if (Status === bookingStatus.BOOKED) {
          response = await hotelBookingModel.find({
            bookingStatus: bookingStatus.BOOKED,
          });
        } else if (Status === bookingStatus.PENDING) {
          response = await hotelBookingModel.find({
            bookingStatus: bookingStatus.PENDING,
          });
        } else if (Status === bookingStatus.CANCEL) {
          response = await hotelBookingModel.find({
            bookingStatus: bookingStatus.CANCEL,
          });
        } else {
          response = await hotelBookingModel.find({});
          const msg = "successfully get all flights bookings";
          actionCompleteResponse(res, response, msg);
        }
      } catch (error) {
        sendActionFailedResponse(res, {}, error.message);
      }
};
