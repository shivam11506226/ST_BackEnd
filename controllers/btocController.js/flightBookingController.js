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
const { userflightBookingServices } = require('../../services/btocServices/flightBookingServices');
const { aggregatePaginate } = require('../../model/role.model');
const { createUserflightBooking, findUserflightBooking, getUserflightBooking, findUserflightBookingData, deleteUserflightBooking, userflightBookingList, updateUserflightBooking, paginateUserflightBookingSearch, aggregatePaginateGetBooking } = userflightBookingServices

exports.flighBooking = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const passengerDetails = data.passengerDetails || [];
    const modifiedPassengers = [];
    for (let i = 0; i < passengerDetails.length; i++) {
      const passenger = passengerDetails[i];
      if (passenger.gender.toLowerCase() === 'male') {
        passenger.gender = 'MALE';
      } else if (passenger.gender.toLowerCase() === 'female') {
        passenger.gender = 'FEMALE';
      } else {
        passenger.gender = 'OTHER';
      }
      modifiedPassengers.push(passenger);
      console.log("Passenger updated",modifiedPassengers)
    }
    
    console.log("modifiedPassengers=============",modifiedPassengers)
    console.log("data=====================",data.airlineDetails)
    const object = {
      bookingId: data.bookingId,
      oneWay: data.oneWay,
      pnr: data.pnr,
      origin: data.origin,
      destination: data.destination,
      paymentStatus: data.paymentStatus,
      dateOfJourney: data.dateOfJourney,
      amount: data.amount,
      userId: isUserExist._id,
      airlineDetails:{
        AirlineName:data.airlineDetails.AirlineName,
        DepTime:data.airlineDetails.DepTime
      },
      passengerDetails: modifiedPassengers,
    };
console.log("object==========",object);
    const result = await createUserflightBooking(object);
console.log("result==========>>>>",result)
    // Uncomment the following lines if you have the necessary functions implemented
    await commonFunction.FlightBookingConfirmationMail(data);
    const send = await sendSMSUtils.sendSMSForFlightBooking(data);

    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.FLIGHT_BOOKED, result });

  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};


exports.getUserflightBooking = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    console.log(req.query);
    const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    console.log("isUSerExist", isUserExist);
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const body = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    }
    const result = await aggregatePaginateGetBooking(body);
    console.log("result=========", result);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
}

exports.getUserFlightData = async (req, res, next) => {
  try {
    const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    console.log("isUSerExist", isUserExist);
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }

    const result = await findUserflightBookingData({ status: status.ACTIVE });
    if (result) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }

}


