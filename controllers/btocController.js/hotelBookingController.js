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
const { createUserhotelBookingModel, findUserhotelBookingModel, getUserhotelBookingModel, deleteUserhotelBookingModel, userhotelBookingModelList, updateUserhotelBookingModel, paginateUserhotelBookingModelSearch,countTotalhotelBooking,aggregatePaginateHotelBookingList } = userhotelBookingModelServices
exports.hotelBooking= async (req, res, next)=> {
    try {
      const data = {
        ...req.body,
      };
      console.log("Room=========>>>>>>>>>",req.body);
      const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE  });
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
        country:req.body.country,
        CheckInDate:req.body.CheckInDate,
        amount:req.body.amount,
        phoneNumber:req.body.phoneNumber.mobile_number,
      }
      const result = await createUserhotelBookingModel(object);
      await commonFunction.HotelBookingConfirmationMail(data)
    // await sendSMS.sendSMSForHotelBooking(isUserExist)
      if(result){
        return res.status(statusCode.OK).send({statusCode:statusCode.OK, message: responseMessage.BOOKING_SUCCESS,result:result });
      }
    } catch (error) {
      console.log("error: ", error);
      return next(error);
    }
  }


  exports.getAllHotelBookingList = async (req, res, next) => {
    try {
      const { page, limit, search, fromDate, toDate } = req.query;
      const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
      if (!isUserExist) {
        return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
      }
      const body={
        page,
        limit,
        search,
        fromDate,
        toDate,
        userId:isUserExist._id, 
      }
      const result = await aggregatePaginateHotelBookingList(body );
      if (result.docs.length == 0) {
        return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
      }
      return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
      console.log("error=======>>>>>>", error);
      return next(error);
    }
  }