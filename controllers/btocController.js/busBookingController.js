import { Status } from 'whatsapp-web.js';

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
const {busBookingService}=require('../../services/btocServices/busBookingServices');
const {createUserBusBooking,findUserBusBooking,getUserBusBooking,findUserBusBookingData,deleteUserBusBooking,userBusBookingList,updateUserBusBooking,paginateUserBusBookingSearch}=busBookingService
export class busController {
    async busBooking(req, res, next) {
        try {
            const { userId } = req.userId;
            const data = {
                ...req.body,
              };
              const isUserExist=await findUser({_id: userId, status:status.ACTIVES});
              if(!isUserExist){
                return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
              }
              const result=await createUserBusBooking(data);
              if(result){
                return res.status(statusCode.OK).send({statusCode:statusCode.OK, message: responseMessage.BUS_BOOKING_CREATED });
              }
        } catch (error) {
            console.log("error: ", error);
            return next(error);
        }
    }

    async getBusBookingList(req,res,next){
        try {
            const { userId } = req.userId;
              const isUserExist=await findUser({_id: userId, status:status.ACTIVES});
              if(!isUserExist){
                return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
              }
              const result=await userBusBookingList({status:status.ACTIVE});
              if(result){
                return res.status(statusCode.OK).send({statusCode:statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
              }
        } catch (error) {
            console.log("error: ", error);
            return next(error);
        }
    }
}
export default new busController();