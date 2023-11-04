const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios =require('axios');
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');

export class flightController{
    async flighBooking(req,res,next){
        try {
            const {userId}=req.userId;
            const data = {
                ...req.body,
              };
            const isUserLogedin=await findUser({_id:userId, status:status.ACTIVE});
            if(!isUserLogedin){
                return res.status(statusCode.NotFound).send({message:responseMessage.USERS_NOT_FOUND});
            }else if(isUserLogedin.userType==="BLOCK"){
                return res.status(statusCode.badRequest).send({message:responseMessage.BLOCK_USER_BY_ADMIN});
            }
            const response = await axios.post(`${api.flightBookingURL}`, data);
            
            return res.status(statusCode.OK).send({message:responseMessage.FLIGHT_BOOKED,result:response});
        } catch (error) {
            
        }
    }

    bookingFLight = async (req, res) => {
        try {
          const data = {
            ...req.body,
          };
      
          const response = await axios.post(`${api.flightBookingURL}`, data);
      
          msg = "Booking Flight Searched Successfully!";
      
          actionCompleteResponse(res, response.data, msg);
        } catch (err) {
          console.log(err);
          sendActionFailedResponse(res, {}, err.message);
        }
      }
}
export default new flightController();