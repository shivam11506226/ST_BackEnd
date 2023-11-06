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
    console.log(response.bookingStatus,"status")

    const msg = "Bus booking details added successfully";
    if(response.bookingStatus === "BOOKED"){
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const content=`      
      name:${response.name},
      phone:${response.phone},
      email:${response.email},
      address:${response.address},
      destination":${response.destination},
      origin:${response.origin},
      dateOfJourney:${response.dateOfJourney},
      busType:${response.busType},
      pnr:${response.pnr},
      busId:${response.busId},
      noOfSeats:${response.noOfSeats},
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
      const pdfFilePath = "bus_booking.pdf";
      fs.writeFileSync(pdfFilePath, pdfBytes);
      await commonFunction.BusBookingConfirmationMail(data, pdfFilePath);
      sendSMS.sendSMSForBusBookingConfirmation(response);
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
