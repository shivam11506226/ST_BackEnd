const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const { userflightBookingServices } = require('../../services/btocServices/flightBookingServices');
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch, aggregatePaginateGetBooking } = userflightBookingServices
const bookingStatus = require('../../enums/bookingStatus');
const { createUserBusBooking, findUserBusBooking, getUserBusBooking, findUserBusBookingData, deleteUserBusBooking, userBusBookingList, updateUserBusBooking, paginateUserBusBookingSearch } = userBusBookingServices
const { userhotelBookingModelServices } = require('../../services/btocServices/hotelBookingServices');
const { createUserhotelBookingModel, findUserhotelBookingModel, getUserhotelBookingModel, deleteUserhotelBookingModel, userhotelBookingModelList, updateUserhotelBookingModel, paginateUserhotelBookingModelSearch,countTotalhotelBooking,aggregatePaginateHotelBookingList } = userhotelBookingModelServices


//**********************************************************API********************************************** */
exports.cancelUserFlightBooking = async (req, res, next) => {
    try {
        const { reason, flightBookingId, bookingId, pnr } = req.body;
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
        // console.log("isAgentExists", isAgentExists);
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const currentDate = new Date().toISOString();
        console.log("currentDate:", currentDate);
        const isBookingExist = await findUserflightBooking({
            userId: isUserExist._id,
            bookingId: bookingId,
            dateOfJourney: { $gt: currentDate }
        });
        console.log("bookingDate=====", isBookingExist)
        if (!isBookingExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const object = {
            userId: isAgentExists._id,
            reason: reason,
            flightBookingId: flightBookingId,
            bookingId: bookingId,
            pnr: pnr,
        }
        const result = await createUserflightBooking(object);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        console.log("error in cancelFlightBooking:", error);
        return next(error);
    }
}

exports.getCancelUserFlightBooking = async (req, res, next) => {
    try {
        
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE, userType:userType.USER });
        // console.log("isAgentExists", isAgentExists);
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        var userId=isUserExist._id;
        const { page, limit, search, fromDate} = req.query;
        const query={page, limit, search, fromDate, userId};
        const result =await aggregatePaginateGetBooking(query);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error to get cancel flight", error);
        return next(error);
    }
}

exports.cancelUserHotelBooking = async (req, res, next) => {
    try {
        const { reason, hotelBookingId, bookingId, pnr, agentId } = req.body;
        const isAgentExists = await findUser({ _id: agentId });
        // console.log("isAgentExists", isAgentExists);
        if (!isAgentExists) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.AGENT_NOT_FOUND });
        }
        const currentDate = new Date().toISOString();
        console.log("currentDate:", currentDate);
        const isBookingExist = await findhotelBooking({
            userId: isAgentExists._id,
            bookingId: bookingId,
            CheckInDate: { $gt: currentDate }
        });
        console.log("bookingDate=====", isBookingExist)
        if (!isBookingExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const object = {
            userId: isAgentExists._id,
            reason: reason,
            hotelBookingId: hotelBookingId,
            bookingId: bookingId,
            pnr: pnr,
        }
        const result = await createHotelCancelRequest(object);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        console.log("error in cancelFlightBooking:", error);
        return next(error);
    }
}

exports.getCancelUserHotelBooking = async (req, res, next) => {
    try {
        const { page, limit, search, fromDate } = req.query;
        const result =await getHotelCancelRequesrByAggregate(req.query);
        console.log("result========",result);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error to get cancel flight", error);
        return next(error);
    }
}

exports.cancelUserBusBooking=async(req,res,next)=>{
    try {
        const { reason, busBookingId, busId, pnr, agentId } = req.body;
        const isAgentExists = await findUser({ _id: agentId });
        // console.log("isAgentExists", isAgentExists);
        if (!isAgentExists) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.AGENT_NOT_FOUND });
        }
        const currentDate = new Date().toISOString();
        console.log("currentDate:", currentDate);
        const isBookingExist=await findUserBusBooking({
            userId: isAgentExists._id,
            busId:busId,
            dateOfJourney:{ $gt: currentDate }
        });
        if (!isBookingExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.BOOKING_NOT_FOUND });
        }
        const object={
            userId:isAgentExists._id,
            reason: reason,
            busBookingId:busBookingId,
            busId:busId,
            pnr: pnr,
        }
        const result=await createBusCancelRequest(object);
        if(!result){
            return res.status(statusCode.InternalError).send({statusCode: statusCode.InternalError,responseMessage:responseMessage.INTERNAL_ERROR})
        } 
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.CANCEL_REQUEST_SEND, result: result });
    } catch (error) {
        console.log("error",error);
        return next(error);
    }
}

exports.getCancelUserBusBooking=async(req,res,next)=>{
    try {
        const { page, limit, search, fromDate } = req.query;
        const result=await paginateUserBusBookingSearch(req.query);
        if (!result) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error",error);
        return next(error);
    }
}