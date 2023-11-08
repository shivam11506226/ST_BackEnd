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
const { userhotelBookingModelServices } = require('../../services/btocServices/hotelBookingServices');
const { createUserhotelBookingModel, findUserhotelBookingModel, getUserhotelBookingModel, deleteUserhotelBookingModel, userhotelBookingModelList, updateUserhotelBookingModel, paginateUserhotelBookingModelSearch,countTotalhotelBooking } = userhotelBookingModelServices
exports.hotelBooking= async (req, res, next)=> {
    try {
      const { userId } = req.userId;
      const data = {
        ...req.body,
      };
      console.log("Room=========>>>>>>>>>",req.body);
      const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
      if (!isUserExist) {
        return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
      }
      const object={
        userId:isUserExist._id,
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        destination:req.body.destination,
        BookingId:req.body.BookingId,
        CheckInDate:req.body.CheckInDate,
        hotelName:req.body.hotelName,
        cityName:req.body.cityName,
        hotelId:req.body.hotelId,
        noOfPeople:req.body.noOfPeople,
        phoneNumber:req.body.phoneNumber.mobile_number,
      }
      const result = await createUserhotelBookingModel(object);
      await commonFunction.HotelBookingConfirmationMail(data)
    //   await sendSMS.sendSMSForHotelBooking(req.body.phoneNumber.mobile_number);
      if(result){
        return res.status(statusCode.OK).send({statusCode:statusCode.OK, message: responseMessage.BOOKING_SUCCESS });
      }
    } catch (error) {
      console.log("error: ", error);
      return next(error);
    }
  }
