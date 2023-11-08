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
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch } = userflightBookingServices

  exports.flighBooking= async (req, res, next) =>{
    try {
      const { userId } = req.userId;
      const data = {
        ...req.body,
      };
      console.log("Room===========",req.body);
      const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
      if (!isUserExist) {
        return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
      }
      const object={
        data,
        userId:isUserExist._id,
      }
      const result = await createUserflightBooking(object);
      await commonFunction.FlightBookingConfirmationMail(data)
      await sendSMSUtils.sendSMSForFlightBooking(mobileNumber,otp);
      if(result){
        return res.status(statusCode.OK).send({statusCode:statusCode.OK, message: responseMessage.FLIGHT_BOOKED });
      }
    } catch (error) {
      console.log("error: ", error);
      return next(error);
    }
  }
