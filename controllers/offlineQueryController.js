const config = require("../config/auth.config");
const db = require("../model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const approvestatus = require("../enums/approveStatus");
//require responsemessage and statusCode
const statusCode = require("../utilities/responceCode");
const responseMessage = require("../utilities/responses");
const sendSMS = require("../utilities/sendSms");
const commonFunction = require("../utilities/commonFunctions");
const whatsappAPIUrl = require("../utilities/whatsApi");

//***********************************SERVICES********************************************** */

const { userServices } = require("../services/userServices");
const userType = require("../enums/userType");
const status = require("../enums/status");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
} = userServices;
const { offlineServices } = require("../services/offlineQueryServices");
const {
  createOffline,
  findOffline,
  deleteOffline,
  offlineList,
  updateOffline,
  paginateOfflineSearch,
  countTotalOffline,
} = offlineServices;

exports.createofflineQuery = async (req, res, next) => {
  try {
    const {
      email,
      contactNumber,
      origin,
      destination,
      message,
      queryType,
    } = req.body;
    const result = await createOffline(req.body);
    console.log("result=====",result)
    if (!result) {  
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          message: responseMessage.QUERY_SUBMITTED,
          result: result,
        });
        return res
        .status(statusCode.InternalError)
        .send({
          statusCode: statusCode.InternalError,
          responseMessage: responseMessage.INTERNAL_ERROR,
        });
    }
    // await sendSMS.sendSMSForOtp(contactNumber)
    
    const msg=`Dear user, thank you for reaching out to The SkyTrails support team. Your query has been submitted, and we will get back to you as soon as possible.`
    await whatsappAPIUrl.sendWhatsAppMessage(contactNumber,msg)
    await commonFunction.senConfirmationQuery(email,contactNumber);
    return res
    .status(statusCode.OK)
    .send({
      statusCode: statusCode.OK,
      message: responseMessage.QUERY_SUBMITTED,
      result: result,
    });
  } catch (error) {
    console.log("Error in creatring offline query", error);
    return next(error);
  }
};

