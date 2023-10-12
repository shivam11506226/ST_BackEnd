
const hotelBookingModel = require('../model/hotelBooking.model');
const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");
const bookingStatus=require('../enums/bookingStatus')
  

exports.addHotelBookingData = async (req,res)=>{
    try {
        const data = {
            userId:req.body.userId,
            name:req.body.name,
            phone:req.body.phone,            
            email:req.body.email,
            address:req.body.address,
            destination:req.body.destination,
            BookingId:req.body.origin,
            toDate:req.body.dateOfJourney,
            fromDate:req.body.busType,
            hotelName:req.body.hotelName,
            hotelId:req.body.hotelId,
            noOfPeople:req.body.noOfPeople,
            cityName:req.body.cityName,
            country:req.body.country,
            room:req.body.room,
            night:req.body.night,
            bookingStatus:bookingStatus.BOOKED
        };
        const response = await hotelBookingModel.create(data);
        const msg = "Hotel booking  successfully";
        actionCompleteResponse(res,response,msg);
    } catch (error) {
        sendActionFailedResponse(res,{},error.message);
    }
}