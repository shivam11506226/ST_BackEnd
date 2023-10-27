const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const flightBookingData = require("../model/flightBookingData.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");
const crypto = require("crypto");
const commonFunction = require("../utilities/commonFunctions");

exports.addFlightBookingData = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };
    const response = await flightBookingData.create(data);
    const msg = "flight booking details add1ed successfully";
    if (response.paymentStatus === "success") {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);

      const content = `
    First Name: ${response.passengerDetails[0].firstName}
    Last Name: ${response.passengerDetails[0].lastName}
    Gender: ${response.passengerDetails[0].gender}
    Phone: ${response.passengerDetails[0].phone.country_code} ${response.passengerDetails[0].phone.mobile_number}
    Date of Birth: ${response.passengerDetails[0].dob}
    Email: ${response.passengerDetails[0].email}
    Address: ${response.passengerDetails[0].address}
    City: ${response.passengerDetails[0].city}
    Country: ${response.passengerDetails[0].country}
    Flight Name: ${response.flightName}
    PNR: ${response.pnr}
    Payment Status: ${response.paymentStatus}
    Transaction ID: ${response.transactionId}
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
      const pdfFilePath = "temp_api_data.pdf";
      fs.writeFileSync(pdfFilePath, pdfBytes);

      await commonFunction.FlightBookingConfirmationMail(data, pdfFilePath);

      // Clean up the temporary PDF file
      fs.unlinkSync(pdfFilePath);
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
