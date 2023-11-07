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
const {userflightBookingServices}=require('../../services/btocServices/flightBookingServices');
const {createUserflightBooking,findUserflightBooking,getUserflightBooking,findUserflightBookingData,deleteUserflightBooking,userflightBookingList,updateUserflightBooking,paginateUserflightBookingSearch}=busBookingService
export class flightController {
  async flighBooking(req, res, next) {
  try {
    
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
  }
}
export default new flightController();