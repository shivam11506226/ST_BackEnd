const flightBookingData = require("../model/flightBookingData.model");
const User = require("../model/user.model");
const Notification = require("../model/notification.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const crypto = require("crypto");
const commonFunction = require("../utilities/commonFunctions");
const {sendWhatsAppMessage}= require('../utilities/whatsApi');
const sendSMS = require("../utilities/sendSms");
const PushNotification = require("../utilities/commonFunForPushNotification");

const {cancelBookingServices}=require("../services/cancelServices");
const {createcancelBooking,updatecancelBooking,aggregatePaginatecancelBookingList,countTotalcancelBooking}=cancelBookingServices;
exports.addFlightBookingData = async (req, res) => {

  try {

    const passengers = req.body.passengerDetails.map((passenger, index) => {
       // Convert index to string as keys in Map are strings
      return passenger
    }
    );
    
    const data = {
      ...req.body,
      // passengerDetails: new Map(passengers),
      passengerDetails:passengers
    };
    console.log(data,"new flight booking")
    
    const response = await flightBookingData.create(data);
    // const data = {
    //   ...req.body,
    // };
    // // console.log(req.body)
    // const response = await flightBookingData.create(data);
    const msg = "flight booking details added successfully";
    // console.log(response.paymentStatus)
    if (response.paymentStatus === "success") {
      // await sendWhatsAppMessage();
      await commonFunction.FlightBookingConfirmationMail(data);
      await sendSMS.sendSMSForFlightBooking(response);
    }
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.getAllFlightsBooking = async (req, res) => {
  try {
    const response = await flightBookingData.find();
    const msg = "successfully get all flights bookings";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
exports.deleteFlightBookings = async (req, res) => {
  try {
    response = await flightBookingData.remove({
      userId: { $in: [req.params.id] },
    });
    const msg = "user booking data deleted successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
exports.deleteAllFlightBookings = async (req, res) => {
  try {
    response = await flightBookingData.destroy();
    const msg = "All booking data deleted successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.getoneFlightsBooking = async (req, res) => {
  try {
    response = await flightBookingData.find({
      userId: { $in: [req.params.id] },
    });
    const msg = "user booking data get successfully";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//==========================================================================
// ===== Send Flight booking Cencel Request For User to admin ==============
//==========================================================================

exports.sendFlightBookingCencelRequestForAdmin = async (req, res) => {
  try {
    const { pnr_no } = req.params;

    // Check if the booking with the given PNRNO exists
    const booking = await flightBookingData.findOne({ pnr: pnr_no });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    } else {
      const isAdmin = await User.find({userType:"ADMIN", status:"ACTIVE"}).select('-_id email username');
      const emailMessage = `Flight Booking Cancellation Request\n\nFlightName: ${booking.flightName}\nPnrNumber: ${booking.pnr}\nEmail: ${booking.passengerDetails[0].email}\nBooking Date: ${booking.createdAt}`;
      const payload = {
        email: isAdmin[0].email,
        message: emailMessage,
      };
      await commonFunction.flightBookingCencelRequestForAdmin(payload);
      const notifyDetails = {
        from: userId,
        title: "Flight Booking Cancellation Request!",
        description: emailMessage,
      };
      await Notification.create(notifyDetails);
      await PushNotification.sendNotification(notifyDetails);
      return res
        .status(200)
        .json({ message: "Booking Cancellation Request successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//=====================================================
//================ Get All Flight Booking List for Admin ========
//=====================================================

exports.getAllFlghtBookingForAdmin = async (req, res) => {
  try {
    const { Status } = req.body;
    let response;
    if (Status === "success") {
      response = await flightBookingData.find({
        paymentStatus: "success",
      });
    } else if (Status === "pending") {
      response = await flightBookingData.find({
        paymentStatus: "pending",
      });
    } else if (Status === "failure") {
      response = await flightBookingData.find({
        paymentStatus: "failure",
      });
    } else {
      response = await flightBookingData.find({});
      const msg = "successfully get all flights bookings";
      actionCompleteResponse(res, response, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

//================================================================
//============= Get Monthly Flight Booking Passenger Calender ====
//================================================================

exports.getMonthlyFlightBookingPassengerCalendar = async (req, res) => {
  try {
    var { year, month } = req.body;
    month = parseInt(month);
    let response;

    if (year && month) {
      // If year and month are provided, retrieve data for the specified month and year.
      response = await flightBookingData.find({
        createdAt: {
          $gte: new Date(year, month - 1, 1),
          $lte: new Date(year, month, 1),
        },
      });
    } else {
      // If year and month are not provided, retrieve data for the current month and year.
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      response = await flightBookingData.find({
        createdAt: {
          $gte: new Date(currentYear, currentMonth - 1, 1),
          $lte: new Date(currentYear, currentMonth, 1),
        },
      });
    }

    // Respond with the data
    const msg = "successfully get all Passegers";
    actionCompleteResponse(res, response, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
