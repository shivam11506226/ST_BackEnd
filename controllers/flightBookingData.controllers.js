
const flightBookingData = require('../model/flightBookingData.model');
const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");
const crypto = require('crypto');

exports.addFlightBookingData = async (req,res)=>{
    try {
        const data = {
            userId:req.body.userId,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            gender:req.body.gender,
            phone:{
                country_code:req.body.phone.country_code,
                mobile_number:req.body.phone.mobile_number
            },
            dob:req.body.dob,
            email:req.body.email,
            address:req.body.address,
            city:req.body.city,
            country:req.body.country,
            flightName:req.body.flightName,
            pnr:req.body.pnr,
            paymentStatus:req.body.paymentStatus,
            transactionId:crypto.createHash('md5').digest('hex').toString()
        };
        const response = await flightBookingData.create(data);
        const msg = "flight booking details added successfully";
        
        actionCompleteResponse(res,response,msg);
    } catch (error) {
        sendActionFailedResponse(res,{},error.message);
    }
}

exports.getAllFlightsBooking = async(req,res)=>{
    try {
        const response = await flightBookingData.find();
        const msg = "successfully get all flights bookings";
        actionCompleteResponse(res,response,msg); 
    } catch (error) {
        sendActionFailedResponse(res,{},error.message);
    }
};
exports.deleteFlightBookings = async(req,res)=>{
    try {
          response = await flightBookingData.remove({userId:{$in:[req.params.id]}});   
          const msg = 'user booking data deleted successfully'
          actionCompleteResponse(res,response,msg);
    } catch (error) {
        sendActionFailedResponse(res,{},error.message);
        
    }
};
exports.deleteAllFlightBookings = async(req,res)=>{
    try {
          response = await flightBookingData.destroy();   
          const msg = 'All booking data deleted successfully'
          actionCompleteResponse(res,response,msg);
    } catch (error) {
        sendActionFailedResponse(res,{},error.message);
        
    }
};

exports.getoneFlightsBooking = async(req,res)=>{
    try {
        response = await flightBookingData.find({userId:{$in:[req.params.id]}});   
        const msg = 'user booking data get successfully'
        actionCompleteResponse(res,response,msg);
  } catch (error) {
      sendActionFailedResponse(res,{},error.message);
  }
};