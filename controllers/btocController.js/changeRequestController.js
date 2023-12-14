const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const userType = require("../../enums/userType");


/**********************************SERVICES********************************** */
const {changeUserBookingServices}=require("../../services/btocServices/changeRequestServices");
const {createUserFlightCancelRequest,flightchangeRequestUserList,createUserHotelCancelRequest,hotelchangeRequestUserList,createUserBusCancelRequest,buschangeRequestUserList}=changeUserBookingServices;
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;



exports.getUserFlightChangeRequest=async(req,res,next)=>{
    try {
        const {page,limit,search}=req.query;
        console.log(" req.userId========", req.userId)
        const isUserExist = await findUser({ _id: req.userId,status:status.ACTIVE });
        console.log("isAgentExists", isUserExist);
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const result=createUserFlightCancelRequest(req.query);
        console.log("================",result);
        if(!result||result.length==0){
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.DATA_FOUND, result: result });
    } catch (error) {
        console.log("error in gettiong change request list",error)
    }
}