const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const axios = require('axios');
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const sendSMSUtils = require('../../utilities/sendSms')
const { userBusBookingServices } = require('../../services/btocServices/busBookingServices');
const { createUserBusBooking, findUserBusBooking, getUserBusBooking, findUserBusBookingData, deleteUserBusBooking, userBusBookingList, updateUserBusBooking, paginateUserBusBookingSearch } = userBusBookingServices

exports.busBooking = async (req, res, next) => {
  try {
    const { userId } = req.userId;
    const data = {
      ...req.body,
    };
    console.log("Room", req.body);
    const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const object={
      data,
      userId:isUserExist._id,
    }
    const result = await createUserBusBooking(object);
    await commonFunction.BusBookingConfirmationMail(data)
    // await sendSMSUtils.sendSMSBusBooking(req.body.phone.mobileNumber);
    if (result) {
      return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BUS_BOOKING_CREATED });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
}

exports.getBusBookingList = async (req, res, next) => {
  try {
    const { userId } = req.userId;
    const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const result = await userBusBookingList({ status: status.ACTIVE });
    if (result) {
      return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
}

