const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
/**********************************SERVICES********************************** */
const { userServices } = require('../../services/userServices');
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require('../../utilities/commonFunctions');
const { advertisementServices } = require("../../services/btocServices/advertisementServices");
const { createadvertisement, findadvertisementData, deleteadvertisement, advertisementList, updateadvertisement, countTotaladvertisement ,getAdvertisment} = advertisementServices;

exports.createadvertismentController = async (req, res, next) => {
    try {
        const { image, title, content, startDate, endDate, remainingDays } = req.body;
        // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
        // if (!isAdmin) {
        //   return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
        // }
        const imageFiles = await commonFunction.getSecureUrl(image);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await createadvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.ADS_CREATED, result: result });
    } catch (error) {
        console.log("error: ", error);
        return next(error);
    }
}

exports.updateadvertisementController = async (req, res, next) => {
    try {
        const { image, title, content, startDate, endDate, remainingDays } = req.body
        const imageFiles = await commonFunction.getSecureUrl(image);
        if (!imageFiles) {
            return res.status(statusCode.InternalError).send({ statusCode: statusCode.OK, message: responseMessage.INTERNAL_ERROR });
        }
        const object = {
            image: imageFiles,
            title: title,
            content: content,
            startDate: startDate,
            endDate: endDate,
            remainingDays: remainingDays
        }
        const result = await updateadvertisement(object);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.UPDATE_SUCCESS, result: result });
    } catch (error) {
        console.log("error", error);
        return next(error);
    }
}

exports.getadvertisementController = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE, userType: userType.USER });
        if (!isUserExist) {
            return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
        }
        const result=await getAdvertisment(req.query);
        if(!result){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,responseMessage:responseMessage.DATA_NOT_FOUND})
        }
        return res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.DATA_FOUND,result:result})
    } catch (error) {
        console.log("Error: " + error);
        return next(error);
    }
}