const responseMessage = require('../utilities/responses');
const statusCode = require('../utilities/responceCode')
const status = require("../enums/status");
const userType = require("../enums/userType");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const commonFunction=require('../utilities/commonFunctions');
const sendSMS=require('../utilities/sendSms');
const { brbuserServices } = require('../services/btobagentServices');
const bookingStatus = require('../enums/bookingStatus');
/**********************************SERVICES********************************** */
const {cancelBookingServices}=require("../services/cancelServices");
const {createcancelBooking,updatecancelBooking,aggregatePaginatecancelBookingList,countTotalcancelBooking}=cancelBookingServices;
const { brbuserServices } = require('../services/btobagentServices');
const { createbrbuser, findbrbuser, getbrbuser, findbrbuserData, updatebrbuser, deletebrbuser, brbuserList, paginatebrbuserSearch, countTotalbrbUser } = brbuserServices;
const { userServices } = require('../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const { aggregatePaginateHotelBookingList, aggregatePaginateHotelBookingList1, findhotelBooking, findhotelBookingData, deletehotelBooking, updatehotelBooking, hotelBookingList, countTotalBooking } = hotelBookingServicess;
const { userBusBookingServices } = require('../services/btocServices/busBookingServices');
const { createUserBusBooking, findUserBusBooking, getUserBusBooking, findUserBusBookingData, deleteUserBusBooking, userBusBookingList, updateUserBusBooking, paginateUserBusBookingSearch } = userBusBookingServices
const { userflightBookingServices } = require('../services/btocServices/flightBookingServices');
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch, aggregatePaginateGetBooking } = userflightBookingServices

//----------------------------------------------MODELS-----------------------------------------     
const flightModel = require('../model/flightBookingData.model')
const hotelBookingModel = require('../model/hotelBooking.model')
const busBookingModel = require("../model/busBookingData.model");




//*******************************CANCELATION API'S ****************************/

exports.cancelFlightBooking=async(req,res,next)=>{
    try {
        const {reason,flightBookingId,bookingId,pnr,agentId}=req.body;
        const isAgentExists = await findbrbuser({ _id: agentId });
        if (!isAgentExists) {
          return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.AGENT_NOT_FOUND });
        }
        
    const isBookingExist = await findhotelBooking({ userId: isAgentExists._id, bookingId: bookingId, status: status.ACTIVE, });
    if (!isBookingExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
    }
    } catch (error) {
        console.log("error in cancelFlightBooking:",error);
        return next(error);
    }
}