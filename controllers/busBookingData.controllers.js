
const busBookingData = require('../model/busBookingData.model');
const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");

  

exports.addBusBookingData = async (req,res)=>{
    try {
        const data = {
            userId:req.body.userId,
            name:req.body.name,
            phone:req.body.phone,            
            email:req.body.email,
            address:req.body.address,
            destination:req.body.destination,
            origin:req.body.origin,
            dateOfJourney:req.body.dateOfJourney,
            busType:req.body.busType,
            pnr:req.body.pnr,
            busId:req.body.busId,
            noOfSeats:req.body.noOfSeats
        };
        const response = await busBookingData.create(data);
        const msg = "Bus booking details added successfully";
        const sendMail=await commonFunction.sendBusBookingConfirmation(data);
        actionCompleteResponse(res,response,msg);
    } catch (error) {
        sendActionFailedResponse(res,{},error.message);
    }
}