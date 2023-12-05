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
const { subAdminServices } = require('../services/subAdminServices');
const { createSubAdmin, findSubAdmin, findSubAdminData, deleteSubAdmin,subAdminList,updateSubAdmin,paginateSubAdminSearch,countTotalSubAdmin } = subAdminServices;



exports.createSubAdmin = async (req, res, next) => {
    try {
        const { username, email, password, mobile_number } = req.body;
        const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
        // if (!isAdmin) {
        //     return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        // }
        const isSubAdminExist = await findSubAdmin({ email: email, userType: 'SUBADMIN', mobile_number: mobile_number });
        if (isSubAdminExist) {
            return res.status(statusCode.Conflict).send({ message: responseMessage.SUBADMIN_ALREADY_EXIST })
        }
        const pass = await bcrypt.hash(password, 10)
        const data = {
            userName: username,
            email: email,
            password: pass,
            contactNumber:  mobile_number ,
        }
        const result = await createSubAdmin(data)
        // const result = {
        //     userName: doc.username,
        //     email: doc.email,
        //     contactNumber: doc.mobile_number,
        //     userType: doc.userType

        // }
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
            const isSubAdminAlreadyExist = await findSubAdmin({ $or: [{ email: email }, { mobile_number: mobile_number }], _id: { $nin: subAdminId } });
            if (isSubAdminAlreadyExist) {
                return res.status(statusCode.Conflict).send({ message: responseMessage.SUBADMIN_ALREADY_EXIST });
            }
        }
        if (profilePic) {
            profilePic = await commonFunction.getSecureUrl(profilePic);
        }
        const result = await updateSubAdmin({ _id: subAdminId }, req.body);
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
        const result = await updateSubAdmin({ _id: subAdminID }, { status: status.DELETE });
        return res.status(statusCode.OK).send({ message: responseMessage.DELETE_SUCCESS, result: result });
    } catch (error) {
        console.log("error======>>>>.", error);
        return next(error);
    }
}

exports.getSubAdmin = async (req, res, next) => {
    try {
        // const isAdmin = await findUser({ _id: req.userId, userType: [userType.ADMIN] });
        // if (!isAdmin) {
        //     return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        // }
        const result = await findSubAdminData({ userType: userType.SUBADMIN });
        return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND,result:result });
    } catch (error) {
        console.log("error======>>>>.", error);
        return next(error);
    }
}

exports.subAdminLogin = async (req, res, next) => {
    try {
        const { email, mobileNumber, password } = req.body;
        const isAdminExist = await findSubAdminData({ $or: [{ email: email }, { mobileNumber: mobileNumber }], userType: userType.SUBADMIN, status: status.ACTIVE });
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
            authType:isAdminExist.authType
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