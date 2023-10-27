const config = require("../config/auth.config");
const db = require("../model");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const commonFunction = require('../utilities/commonFunctions');
const approvestatus = require('../enums/approveStatus')
//require responsemessage and statusCode
const statusCode = require('../utilities/responceCode');
const responseMessage = require('../utilities/responses')
//***********************************SERVICES********************************************** */

const { userServices } = require('../services/userServices');
const userType = require("../enums/userType");
const status = require("../enums/status");
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;


exports.createSubAdmin = async (req, res, next) => {
    try {
        const { username, email, password, mobile_number } = req.body;
        const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
        if (!isAdmin) {
            return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        }
        const isSubAdminExist = await findUser({ email: email, userType: 'SUBADMIN', mobile_number: mobile_number });
        if (isSubAdminExist) {
            return res.status(statusCode.Conflict).send({ message: responseMessage.SUBADMIN_ALREADY_EXIST })
        }
        const pass = await bcrypt.hash(password, 10)
        const data = {
            username: username,
            email: email,
            password: pass,
            phone: { mobile_number: mobile_number },
            approveStatus: approvestatus.APPROVED,
            userType: userType.SUBADMIN
        }
        const doc = await createUser(data)
        const result = {
            username: doc.username,
            email: doc.email,
            mobileNumber: doc.phone.mobile_number,
            userType: doc.userType

        }
        return res.status(statusCode.Conflict).send({ message: responseMessage.SUBADMIN_CREATED, result: result });

    } catch (error) {
        console.log("error======>>>>.", error);
        return next(error)
    }
};

exports.updateSubAdmin = async (req, res, next) => {
    try {
        const { subAdminId, username, email, mobile_number, profilePic, } = req.body;
        const isAdmin = await findUser({ _id: req.userId, userType: [userType.ADMIN, userType.SUBADMIN] });
        if (!isAdmin) {
            return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        }
        if (email || mobile_number) {
            const isSubAdminAlreadyExist = await findUser({ $or: [{ email: email }, { mobile_number: mobile_number }], _id: { $nin: subAdminId } });
            if (isSubAdminAlreadyExist) {
                return res.status(statusCode.Conflict).send({ message: responseMessage.SUBADMIN_ALREADY_EXIST });
            }
        }
        if (profilePic) {
            profilePic = await commonFunction.getSecureUrl(profilePic);
        }
        const result = await updateUser({ _id: subAdminId }, req.body);
        return res.status(statusCode.OK).send({ message: responseMessage.UPDATE_SUCCESS, result: result });
    } catch (error) {
        console.log("error======>>>>.", error);
        return next(error);
    }
}

exports.deleteSubAdmin = async (req, res, next) => {
    try {
        const { subAdminID } = req.body;
        const isAdmin = await findUser({ _id: req.userId, userType: [userType.ADMIN] });
        if (!isAdmin) {
            return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        }
        const result = await updateUser({ _id: subAdminID }, { status: status.DELETE });
        return res.status(statusCode.OK).send({ message: responseMessage.DELETE_SUCCESS, result: result });
    } catch (error) {
        console.log("error======>>>>.", error);
        return next(error);
    }
}

exports.getSubAdmin = async (req, res, next) => {
    try {
        const isAdmin = await findUser({ _id: req.userId, userType: [userType.ADMIN] });
        if (!isAdmin) {
            return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        }
        const result = await findUserData({ userType: userType.SUBADMIN });
        return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND,result:result });
    } catch (error) {
        console.log("error======>>>>.", error);
        return next(error);
    }
}

exports.subAdminLogin = async (req, res, next) => {
    try {
        const { email, mobileNumber, password } = req.body;
        const isAdminExist = await findUser({ $or: [{ email: email }, { mobileNumber: mobileNumber }], userType: userType.SUBADMIN, status: status.ACTIVE });
        if (!isAdminExist) {
            return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND })
        }
        const isMatched = bcrypt.compareSync(password, isAdminExist.password);
        if (!isMatched) {
            return res.status(statusCode.badRequest).send({ message: responseMessage.INCORRECT_LOGIN })
        }
        const token = await commonFunction.getToken({
            id: isAdminExist._id,
            email: isAdminExist.email,
            userType: isAdminExist.userType,
        });
        const result = {
            token, isAdminExist
        }
        return res.status(statusCode.OK).send({ message: responseMessage.LOGIN, result: result });
    } catch (error) {
        console.log("error=======>>>>>>", error);
        return next(error)
    }
}