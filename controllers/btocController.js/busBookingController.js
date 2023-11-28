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
const { userBusBookingServices } = require('../../services/btocServices/busBookingServices');
const bookingStatus = require('../../enums/bookingStatus');
const { createUserBusBooking, findUserBusBooking, getUserBusBooking, findUserBusBookingData, deleteUserBusBooking, userBusBookingList, updateUserBusBooking, paginateUserBusBookingSearch } = userBusBookingServices

exports.busBooking = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
    };
    console.log("Room", req.body);
    const isUserExist = await findUser({ _id: req.userId, status: status.ACTIVE });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, responseMessage: responseMessage.USERS_NOT_FOUND });
    }
    console.log("==========================",isUserExist);
    const object = {
      userId: isUserExist._id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      destination: req.body.destination,
      origin: req.body.origin,
      dateOfJourney: req.body.dateOfJourney,
      busType: req.body.busType,
      pnr: req.body.pnr,
      busId: req.body.busId,
      noOfSeats: req.body.noOfSeats,
      amount: req.body.amount,
    }
    const result = await createUserBusBooking(object);
    // await commonFunction.BusBookingConfirmationMail(data)
    // await sendSMS.sendSMSBusBooking(isUserExist);
    if (result) {
      return res.status(statusCode.OK).send({ statusCode: statusCode.OK, responseMessage: responseMessage.BUS_BOOKING_CREATED, result: result });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
}

exports.getBusBookingList = async (req, res, next) => {
  try {
    const { userId } = req.userId;
    const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const result = await userBusBookingList({ status: status.ACTIVE });
    if (result) {
      return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.BOOKING_NOT_FOUND });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
}

//************GETALL BUSBOKING DETAILS****************/

// exports.getAllAgentBusBookingList = async (req, res, next) => {
//   try {
//     const { page, limit, search } = req.query;
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).send({ message: 'Invalid userId' });
//     }
//     const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
//     if (!isUserExist) {
//       return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
//     }
//     if (search) {
//       var filter = search;
//     }
//     let data = filter || "";
//     const pipeline = [
//       {
//         $match: {
//           userId: mongoose.Types.ObjectId(userId)
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: 'userId',
//           foreignField: '_id',
//           as: "userDetails",
//         }
//       },
//       {
//         $unwind: {
//           path: "$userDetails",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $match: {
//           $or: [
//             { "destination": { $regex: data, $options: "i" } },
//             { "userDetails.username": { $regex: data, $options: "i" } },
//             { "userDetails.email": { $regex: data, $options: "i" } },
//             { "paymentStatus": { $regex: data, $options: "i" } },
//             { "pnr": { $regex: data, $options: "i" } },
//             { "origin": { $regex: data, $options: "i" } },
//             { "dateOfJourney": { $regex: data, $options: "i" } },
//             { "busType": { $regex: data, $options: "i" } },
//             { "busId": parseInt(data) },
//             { "name": { $regex: data, $options: "i" } },
//             { "bookingStatus": { $regex: data, $options: "i" } }
//           ],
//         }
//       },
//     ]
//     let aggregate = busBookingModel.aggregate(pipeline);
//     const options = {
//       page: parseInt(page, 10) || 1,
//       limit: parseInt(limit, 10) || 10,
//     };
//     const result = await busBookingModel.aggregatePaginate(aggregate, options);
//     if (result.docs.length == 0) {
//       return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
//     }
//     return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
//   } catch (error) {
//     console.log("error=======>>>>>>", error);
//     return next(error);
//   }
// }
