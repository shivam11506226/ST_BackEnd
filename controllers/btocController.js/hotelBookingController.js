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
const whatsApi=require("../../utilities/whatsApi")
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
        bookingId:req.body.BookingId,
        CheckInDate:req.body.CheckInDate,
        hotelName:req.body.HotelName,
        cityName:req.body.cityName,
        hotelId:req.body.hotelId,
        noOfPeople:req.body.noOfPeople,
        country:req.body.country,
        CheckOutDate:req.body.CheckOutDate,
        amount:req.body.amount,
        phoneNumber:{mobile_number:req.body.phoneNumber},
        hotelName:req.body.hotelName
      }
      const result = await createUserhotelBookingModel(object);
      console.log("result==========",result)
      if(result){
        const message = `Hello ${data.name} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:. Or You Can login theskytrails.com/login`
        await sendSMS.sendSMSForHotelBooking(result);
        await whatsApi.sendWhatsAppMessage(result.phoneNumber.mobile_number, message);
        await commonFunction.HotelBookingConfirmationMail(data);
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