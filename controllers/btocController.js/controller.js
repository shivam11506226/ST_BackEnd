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
            // await commonFunction.sendSMS(mobileNumber,otp);
            token = await commonFunction.getToken({ _id: result1._id, mobile_number: result1.mobile_number });
            const result = {
                firstTime: result1.firstTime,
                _id: result1._id,
                phone: result1.phone,
                userType: result1.userType,
                otpVerified: result1.otpVerified,
                status: result1.status,
                otp: otp,
                token: token
            }
            return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.LOGIN_SUCCESS, result: result });
        }
        let result1 = await updateUser({ 'phone.mobile_number': mobileNumber, status: status.ACTIVE }, obj);
        await sendSMS.sendSMSForOtp(mobileNumber,otp)
        if (!result1) {
            return res.status(statusCode.InternalError).json({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        token = await commonFunction.getToken({ _id: result1._id, 'mobile_number': result1.phone.mobile_number });
        const result = {
            firstTime: result1.firstTime,
            _id: result1._id,
            phone: result1.phone,
            userType: result1.userType,
            otpVerified: result1.otpVerified,
            otp: otp,
            status: result1.status,
            token: token
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.LOGIN_SUCCESS, result: result });
    } catch (error) {
        console.log("error====>>>>>", error);
        return next(error)
    }
}



exports.verifyUserOtp = async (req, res, next) => {
    try {
        const { otp, fullName, dob } = req.body;
        const isUserExist = await findUserData({ _id: req.userId });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        if (isUserExist.otp !== otp) {
            return res.status(statusCode.badRequest).json({ statusCode: statusCode.badRequest, message: responseMessage.INCORRECT_OTP });
        }
        if (new Date().getTime() > isUserExist.otpExpireTime) {
            return res.status(statusCode.badRequest).json({ statusCode: statusCode.badRequest, message: responseMessage.OTP_EXPIRED });
        };
        const updation = await updateUser({ _id: isUserExist._id, status: status.ACTIVE }, { otpVerified: true });
        console.log("======================", updation);
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
        const updateData = await updateUser({ _id: updation._id }, { username: fullName, dob: dob, otp: "", firstTime: false });
        const token = await commonFunction.getToken({ _id: updation._id, 'mobile_number': updation.phone.mobile_number, username: fullName });
        const result = {
            phoneNumber: updateData.phone,
            _id: updateData._id,
            firstTime: updation.firstTime,
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


exports.resendOtp = async (req, res, next) => {
    try {
        const { mobileNumber } = req.body;
        const otp = commonFunction.getOTP();
        const otpExpireTime = new Date().getTime() + 300000;
        const isExist = await findUser({ 'phone.mobile_number': mobileNumber, status: status.ACTIVE });
        if (!isExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const updateData = await updateUser({ _id: isExist._id, status: status.ACTIVE }, { otp: otp, otpExpireTime: otpExpireTime });
        if (!updateData) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        // await commonFunction.sendSMS(mobileNumber,otp);
        const token = await commonFunction.getToken({ _id: updateData._id, 'mobile_number': updateData.phone.mobile_number });
        const result = {
            firstTime: updateData.firstTime,
            _id: updateData._id,
            phone: updateData.phone,
            userType: updateData.userType,
            otpVerified: updateData.otpVerified,
            otp: otp,
            status: updateData.status,
            token: token
        }
        console.log("result========", result);
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.OTP_SEND, result: result })
    } catch (error) {
        console.log("error==========>>>>>>.", error);
        return next(error);
    }
}

exports.uploadImage = async (req, res, next) => {
    try {
        const { profilePic } = req;
        const isUserExist = await findUserData({ _id: req.userId });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const imageFiles = await commonFunction.getSecureUrl(profilePic);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const result = await updateUser({ _id: isUserExist._id }, { profilePic: imageFiles });
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.UPLOAD_SUCCESS, result: result });
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
}


exports.getUserProfile = async (req, res, next) => {
    try {
        const isUserExist = await findUserData({ _id: req.userId ,status:status.ACTIVE });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.USERS_FOUND, result: isUserExist });
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
}






