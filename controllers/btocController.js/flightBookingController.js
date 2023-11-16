const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require('axios');
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const sendSMSUtils = require('../../utilities/sendSms');
const { userflightBookingServices } = require('../../services/btocServices/flightBookingServices');
const { aggregatePaginate } = require('../../model/role.model');
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch, aggregatePaginateGetBooking } = userflightBookingServices

exports.flighBooking = async (req, res, next) => {
  try {
    const data = { ...req.body};
    console.log("Room===========", req.body);
    const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    console.log("=================ISUSER", isUserExist)
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const passengers = data.Passengers || [];
    const object = {
      data,
      userId: isUserExist._id,
      passengerDetails: passengers,
    }
    // let msg="Flight booked successfully"
    const result = await createUserflightBooking(object);
    await commonFunction.FlightBookingConfirmationMail(data)
    // await sendSMSUtils.sendSMSForFlightBooking(req.body.mobileNumber);
    if (result) {
      return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.FLIGHT_BOOKED });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
}

exports.getUserflightBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    console.log(req.query);
    const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    console.log("isUSerExist", isUserExist);
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const body = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    }
    const result = await aggregatePaginateGetBooking(body);
    console.log("result=========", result);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
}


