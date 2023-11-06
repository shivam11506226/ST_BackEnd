const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
//******************************************User SignUp api*************************/

exports.signUp = async (req, res, next) => {
    try {
        const { email, mobileNumber, password } = req.body;
        const isAlreadyExist = await findUser({ mobileNumber: mobileNumber, status: status.ACTIVE });
        if (!isAlreadyExist) {
            return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
        }
        const hashPass = bcrypt.hashSync(password, 10);
        otp = commonFunction.getOTP();
        otpExpireTime = new Date().getTime() + 300000;
        const object = {
            mobileNumber: mobileNumber,
            password: hashPass,
            otp: otp,
            otpExpireTime: otpExpireTime
        }
        const result = createUser(object);
        return res.status(statusCode.OK).send({ message: responseMessage.SIGNUP_SUCCESS, result: result })
    } catch (error) {
        console.log("error=====>", error);
        return next(error)
    }

}


exports.login = async (req, res, next) => {
    try {
        const { mobileNumber } = req.body;
        const otp = commonFunction.getOTP();
        const otpExpireTime = new Date().getTime() + 300000;
        const obj = {
            phone: {
                mobile_number: mobileNumber
            },
            otp: otp,
            otpExpireTime: otpExpireTime
        }
        const isExist = await findUser({ 'phone.mobile_number': mobileNumber, status: status.ACTIVE });
        if (!isExist) {
            const result1 = await createUser(obj);
            token = await commonFunction.getToken({ _id: result1._id, mobile_number: result1.mobile_number });
            const result = {
                firstTime: result1.firstTime,
                _id: result1._id,
                phone: result1.phone,
                userType: result1.userType,
                otpVerified: result1.otpVerified,
                status: result1.status,
                otp:result1.otp,
                token: token
            }
            return res.status(statusCode.OK).send({ statusCode:statusCode.OK,message: responseMessage.LOGIN_SUCCESS, result: result });
        }
        let result1 = await updateUser({ 'phone.mobile_number': mobileNumber, status: status.ACTIVE }, obj);
         if (!result1) {
            return res.status(statusCode.InternalError).json({statusCode:statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        token = await commonFunction.getToken({ _id: result1._id, 'mobile_number': result1.phone.mobile_number });
        const result = {
            firstTime: result1.firstTime,
            _id: result1._id,
            phone: result1.phone,
            userType: result1.userType,
            otpVerified: result1.otpVerified,
            otp:result1.otp,
            status: result1.status,
            token: token
        }
        return res.status(statusCode.OK).send({ statusCode:statusCode.OK,message: responseMessage.LOGIN_SUCCESS, result: result });
    } catch (error) {
        console.log("error====>>>>>", error);
        return next(error)
    }
}

// exports.verifyOtp=async(req,res,next)=>{
//     try {
//         console.log("========req.userId===========",req.userId);
//         var {otp,email,username,Address,profilePic,password}=req.body;
//         const isUserExist = await findUserData({ _id:req.userId, status: status.ACTIVE });
//         if (!isUserExist) {
//             return res.status(statusCode.badRequest).json({ message: responseMessage.USERS_NOT_FOUND })
//         }
//         if (isUserExist.otp !== otp) {
//             return res.status(statusCode.badRequest).json({ message: responseMessage.INCORRECT_OTP });
//         }
//         if (new Date().getTime() > isUserExist.otpExpireTime) {
//             return res.status(statusCode.badRequest).json({ message: responseMessage.OTP_EXPIRED });
//         };
//         const updation=await updateUser({_id:isUserExist._id,status:status.ACTIVE},{otpVerified:true,otp:" "});
//         if(updation.email===null||updation.email===""||updation.email===undefined||updation.username===null||updation.username===""||updation.username===undefined){
//             const hashPass= bcrypt.hashSync(password,10);
//             if (profilePic && profilePic !== '') {
//                 req.body.profilePic = await commonFunction.uploadImage(profilePic);
//             }
//             const object={
//                 email:email,
//                 username:username,
//                 Address:Address,
//                 password:hashPass,
//                 profilePic:profilePic
//             }
//             const result=await createUser(object);
//             return res.status(statusCode.OK).send({ message: responseMessage.REGISTER_SUCCESS, result: result })
//         }
//         const token = await commonFunction.getToken({ _id: updation._id, 'mobile_number': updation.phone.mobile_number });
//         const result={
//             updation,
//             token
//         }
//         return res.status(statusCode.OK).send({message:responseMessage.OTP_VERIFY,result:result});
//     } catch (error) {
//         console.log("error===========",error);
//         return next(error)
//     }
// }

exports.verifyUserOtp = async (req, res, next) => {
    try {
        const { otp, fullName, dob } = req.body;
        const isUserExist = await findUserData({ _id: req.userId });
        if (isUserExist.otp !== otp) {
            return res.status(statusCode.badRequest).json({statusCode:statusCode.badRequest, message: responseMessage.INCORRECT_OTP });
        }
        if (new Date().getTime() > isUserExist.otpExpireTime) {
            return res.status(statusCode.badRequest).json({statusCode:statusCode.badRequest, message: responseMessage.OTP_EXPIRED });
        };
        const updation = await updateUser({ _id: isUserExist._id, status: status.ACTIVE }, { otpVerified: true });
        if (updation.firstTime === false) {
            const token = await commonFunction.getToken({ _id: updation._id, 'mobile_number': updation.phone.mobile_number });
            const result = {
                firstTime: updation.firstTime,
                _id: updation._id,
                phone: updation.phone,
                userType: updation.userType,
                otpVerified: updation.otpVerified,
                status: updation.status,
                token: token
            }
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.OTP_VERIFY, result: result });
        }
        if (!fullName & !dob) {
            return res.status(statusCode.OK).send({ statusCode: statusCode.Forbidden, message: responseMessage.FIELD_REQUIRED })
        }
        const updateData = await updateUser({ _id: updation._id }, { username: fullName, dob: dob, otp: "" });
        const token = await commonFunction.getToken({ _id: updation._id, 'mobile_number': updation.phone.mobile_number, username: fullName });
        const result = {
            phoneNumber: updateData.phone,
            _id: updateData._id,
            firstTime: updateData.firstTime,
            dob: updateData.dob,
            token: token,
            status: updateData.status,
            otpVerified: updateData.otpVerified,
            userType: updateData.userType,
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.REGISTER_SUCCESS, result: result });
    } catch (error) {
        console.log("Error==============>", error);
        return next(error);
    }
}












