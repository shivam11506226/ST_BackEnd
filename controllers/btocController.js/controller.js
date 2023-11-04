const responseMessage=require('../../utilities/responses');
const statusCode=require('../../utilities/responceCode')
const status = require("../../enums/status");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
/**********************************SERVICES********************************** */
const {userServices}=require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");

//******************************************User SignUp api*************************/

exports.signUp=async(req,res,next)=>{
    try {
         const{email,mobileNumber,password}=req.body;
    const isAlreadyExist=await findUser({ mobileNumber: mobileNumber , status: status.ACTIVE});
    if(!isAlreadyExist){
        return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
    }
    const hashPass=bcrypt.hashSync(password,10);
    otp = commonFunction.getOTP();
    otpExpireTime = new Date().getTime() + 300000;
    const object={
        mobileNumber:mobileNumber,
        password:hashPass,
        otp:otp,
        otpExpireTime:otpExpireTime
    }
    const result=createUser(object);
    return res.status(statusCode.OK).send({message:responseMessage.SIGNUP_SUCCESS, result:result})
    } catch (error) {
        console.log("error=====>",error);
        return next(error)
    }
   
}