const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const hotelBookingModel = require("../model/hotelBooking.model");
const Notification = require("../model/notification.model");
const User = require("../model/user.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const bookingStatus = require("../enums/bookingStatus");
const commonFunction = require("../utilities/commonFunctions");
const { log } = require("console");
const sendSMS = require("../utilities/sendSms");
const PushNotification = require("../utilities/commonFunForPushNotification");


//****************************************SERVICES**************************************/
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const { aggregatePaginateHotelBookingList, findhotelBooking, findhotelBookingData, deletehotelBooking, updatehotelBooking, hotelBookingList, countTotalBooking } = hotelBookingServicess;

exports.addHotelBookingData = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      destination: req.body.destination,
      bookingId: req.body.bookingId,
      CheckInDate: req.body.CheckInDate,
      CheckOutDate : req.body.CheckOutDate,
      hotelName: req.body.hotelName,
      hotelId: req.body.hotelId,
     
      cityName: req.body.cityName,
      country: req.body.country,
      room: req.body.room,
      noOfNight: req.body.noOfNight,
      amount:req.body.amount,
      bookingStatus: bookingStatus.BOOKED,
    };
    const response = await hotelBookingModel.create(data);
    // console.log("response==========", response);
    const msg = "Hotel booking  successfully";
    if (response.bookingStatus === "BOOKED") {
      // await commonFunction.sendHotelBookingConfirmation(data);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const content=`      
      name:${response.name},
      phone:${response.phone},
      email:${response.email},
      address:${response.address},
      destination":${response.destination},
      hotelName:${response.hotelName},
      CheckInDate:${response.CheckInDate},
      BookingId:${response.BookingId},
      noOfNight:${response.noOfNight},
      noOfPeople:${response.noOfPeople},
      cityName:${response.cityName},
      country:${response.country},
      amount:${response.amount},
      bookingStatus:${response.bookingStatus}
      `;

      page.drawText(content, {
        x: 50,
        y: 350,
        size: 12,
        color: rgb(0, 0, 0),
      });

      // Serialize the PDF to bytes  
      const pdfBytes = await pdfDoc.save();

      // Write the PDF to a temporary file
      const pdfFilePath = "hotel_booking.pdf";
      fs.writeFileSync(pdfFilePath, pdfBytes);

      await commonFunction.HotelBookingConfirmationMail(data, pdfFilePath);  
      
      // await sendSMS.sendSMSForHotelBooking(response);
    }

    
    actionCompleteResponse(res, response, msg);
    
  } catch (error) {
    console.log("heelelele")
    sendActionFailedResponse(res, {}, error.message);
  }
};

//=====================================================
// ===== Send Hotel booking Cencel Request For admin ==
//=====================================================

exports.sendHotelBookingCencelRequestForAdmin = async () => {
  try {
    const { bookingId } = req.params;

    // Check if the booking with the given bookingId exists
    const booking = await hotelBookingModel.findOne({ BookingId: bookingId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    } else {
      const isAdmin = await User.find({userType:"ADMIN", status:"ACTIVE"}).select('-_id email username');
      const emailMessage = `Hotel Booking Cancellation Request\n\nName: ${booking.name}\nEmail: ${booking.email}\nCheck-in Date: ${booking.CheckInDate}\nCheck-out Date: ${booking.CheckOutDate}`;
      const payload = {
        email: isAdmin[0].email,
        message: emailMessage,
      };
      await commonFunction.hotelBookingCencelRequestForAdmin(payload);
      const notifyDetails = {
        from: userId,
        title: "Hotel Booking Cancellation Request!",
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
