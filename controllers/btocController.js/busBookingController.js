const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");
const status = require("../../enums/status");
const bcrypt = require("bcryptjs");
const axios = require("axios");
/**********************************SERVICES********************************** */
const { userServices } = require("../../services/userServices");
const {
  createUser,
  findUser,
  getUser,
  findUserData,
  updateUser,
  paginateUserSearch,
  countTotalUser,
} = userServices;
const userType = require("../../enums/userType");
const sendSMS = require("../../utilities/sendSms");
const commonFunction = require("../../utilities/commonFunctions");
const {
  userBusBookingServices,
} = require("../../services/btocServices/busBookingServices");
const bookingStatus = require("../../enums/bookingStatus");
const {
  createUserBusBooking,
  findUserBusBooking,
  getUserBusBooking,
  findUserBusBookingData,
  deleteUserBusBooking,
  userBusBookingList,
  updateUserBusBooking,
  paginateUserBusBookingSearch,
} = userBusBookingServices;
const whatsApi = require("../../utilities/whatsApi");

exports.busBooking = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
    };
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          responseMessage: responseMessage.USERS_NOT_FOUND,
        });
    }
    data.userId=isUserExist._id
    const result = await createUserBusBooking(data);
    const userName =`${result.passenger[0].firstName} ${result.passenger[0].lastName}`
    const message = `Hello ${userName} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:. Or You Can login theskytrails.com/login`;
    await sendSMS.sendSMSBusBooking(result.passenger[0].Phone, userName);
    await whatsApi.sendWhatsAppMessage(result.passenger[0].Phone, message);
    await commonFunction.BusBookingConfirmationMail(result);

    if (result) {
      return res
        .status(statusCode.OK)
        .send({
          statusCode: statusCode.OK,
          responseMessage: responseMessage.BUS_BOOKING_CREATED,
          result: result,
        });
    }
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

exports.getBusBookingList = async (req, res, next) => {
  // try {
  //   const { userId } = req.userId;
  //   console.log(userId,"userId")
  //   const isUserExist = await findUser({ _id: userId, status: status.ACTIVE});
  //   if (!isUserExist) {
  //     return res
  //       .status(statusCode.NotFound)
  //       .send({
  //         statusCode: statusCode.NotFound,
  //         message: responseMessage.USERS_NOT_FOUND,
  //       });
  //   }
  //   const result = await userBusBookingList({ status: status.ACTIVE });
  //   if (result) {
  //     return res
  //       .status(statusCode.OK)
  //       .send({
  //         statusCode: statusCode.OK,
  //         message: responseMessage.BOOKING_NOT_FOUND,
  //       });
  //   }
  // } catch (error) {
  //   console.log("error: ", error);
  //   return next(error);
  // }
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    if (!isUserExist) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.USERS_NOT_FOUND,
        });
    }
    const body = {
      page,
      limit,
      search,
      fromDate,
      toDate,
      userId: isUserExist._id,
    };
    const result = await paginateUserBusBookingSearch(body);
    console.log("result=========", result);
    if (result.docs.length == 0) {
      return res
        .status(statusCode.NotFound)
        .send({
          statusCode: statusCode.NotFound,
          message: responseMessage.DATA_NOT_FOUND,
        });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};

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

exports.getUserBusData = async (req, res, next) => {
  try {
    const isUserExist = await findUser({
      _id: req.userId,
      status: status.ACTIVE,
    });
    console.log("isUSerExist", isUserExist);
    if (!isUserExist) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.USERS_NOT_FOUND,
      });
    }

    const result = await userBusBookingList({ status: status.ACTIVE,userId:isUserExist._id });
    if (result) {
      return res.status(statusCode.NotFound).send({
        statusCode: statusCode.NotFound,
        message: responseMessage.DATA_NOT_FOUND,
      });
    }
    return res
      .status(statusCode.OK)
      .send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error: ", error);
    return next(error);
  }
};
