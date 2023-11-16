const config = require("../config/auth.config");
const db = require("../model");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { userInfo } = require("os");
const commonFunction = require('../utilities/commonFunctions');
const approvestatus = require('../enums/approveStatus')
//require responsemessage and statusCode
const statusCode = require('../utilities/responceCode');
const responseMessage = require('../utilities/responses');
//***********************************SERVICES********************************************** */

const { userServices } = require('../services/userServices');
const userType = require("../enums/userType");
const status = require("../enums/status");
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const { aggregatePaginateHotelBookingList,aggregatePaginateHotelBookingList1, findhotelBooking, findhotelBookingData, deletehotelBooking, updatehotelBooking, hotelBookingList, countTotalBooking } = hotelBookingServicess;
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const { visaServices } = require('../services/visaServices');
const { createWeeklyVisa, findWeeklyVisa, deleteWeeklyVisa, weeklyVisaList, updateWeeklyVisa, weeklyVisaListPaginate } = visaServices;
const { brbuserServices } = require('../services/btobagentServices');
const { createbrbuser, findbrbuser, getbrbuser, findbrbuserData, updatebrbuser, deletebrbuser, brbuserList, paginatebrbuserSearch, countTotalbrbUser } = brbuserServices;
const {userflightBookingServices}=require('../services/btocServices/flightBookingServices')
const{aggregatePaginateGetBooking1}=userflightBookingServices;
//***************************Necessary models**********************************/
const flightModel = require('../model/flightBookingData.model')
const hotelBookingModel = require('../model/hotelBooking.model')
const busBookingModel = require("../model/busBookingData.model");
const userFlightBookingModel=require("../model/btocModel/flightBookingModel");
const userhotelBookingModel=require("../model/btocModel/flightBookingModel");
const userbusBookingModel=require("../model/btocModel/flightBookingModel")
const bookingStatus = require("../enums/bookingStatus");
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    phone: {
      country_code: req.body.country_code,
      mobile_number: req.body.phone.mobile_number,
    },
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  // need change username to email for body parser then successfully login
  User.findOne({
    email: req.body.username,
    // $or:[{email:req.body.email},{username:req.body.username}]
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

//****************************************************SOCIAL LOGIN************************************************** */
exports.socialLogin = async (req, res, next) => {
  try {
    const { socialId, socialType, deviceType, deviceToken, username, email, mobileNumber, password, userId } = req.body;
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    const user = await User.findOne({ $or: [{ _id: userId }, { email: email }] });
    if (!user) {
      const hashedPass = bcrypt.hashSync(password, 10);

      const data = {
        socialId: socialId,
        socialType: socialType,
        deviceType: deviceType,
        deviceToken: deviceToken,
        username: username,
        email: email,
        isSocial: true,
        isOnline: true,
        otpVerification: true,
        firstTime: false,
        phone: {
          mobile_number: mobileNumber
        },
        password: hashedPass || ''
      };
      const result = await User.create(data)
      return res.status(200).send({ message: 'Your account created successfully.', result: result })
    }
    let token = await commonFunction.getToken({
      id: userInfo._id,
      email: userInfo.email,
      userType: userInfo.userType,
    });
    const data = {
      socialId: socialId,
      socialType: socialType,
      deviceType: deviceType,
      deviceToken: deviceToken,
      username: username,
      email: email,
      isSocial: true,
      isOnline: true,
      otpVerification: true,
      firstTime: false,
      phone: {
        mobile_number: mobileNumber
      },

    };
    await User.findOneAndUpdate({ _id: user._id }, data, { new: true });
    return res.status(200).json({ message: 'Social login successful.', result: user, token });

  } catch (error) {
    console.log("error========>>>>>>", error);
    return next(error);
  }
}

//approve regect user request to become an agent**************************************************************************

exports.approveAgent = async (req, res, next) => {
  try {
    const { userId, approveStatus, reason } = req.body;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
    // }
    const iUserExist = await findbrbuser({ _id: userId, userType: userType.AGENT });
    if (!iUserExist) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.USER_NOT_FOUND });
    }
    let updateResult = await updatebrbuser({ _id: iUserExist._id }, { approveStatus: approveStatus, isApproved: true, reason: reason });
    if (approveStatus === approvestatus.APPROVED) {
      return res.status(statusCode.OK).send({ message: responseMessage.APPROVED, result: updateResult });
    } else {
      return res.status(statusCode.OK).send({ message: responseMessage.REJECTED, result: updateResult });
    }
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error)
  }
}

//active blockuser ****************************************************************

exports.activeBlockUser = async (req, res, next) => {
  try {
    const { userId, actionStatus } = req.body;
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.Unauthorized).send({ message: "User not authorized ." });
    }
    const iUserExist = await findUser({ _id: userId, status: status.ACTIVE });
    if (!iUserExist) {
      return res.status(statusCode.NotFound).send({ message: "User not Found ." });
    }
    let updateResult = await updateUser({ _id: iUserExist._id }, { status: actionStatus });
    if (actionStatus === status.ACTIVE) {
      return res.status(statusCode.OK).send({ message: "User active successfully .", result: updateResult });
    } else {
      return res.status(statusCode.OK).send({ message: "User blocked successfully .", result: updateResult });
    }
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error)
  }
}
//active block agents ****************************************************************

exports.activeBlockUser = async (req, res, next) => {
  try {
    const { userId, actionStatus } = req.body;
    const isAdmin = await findbrbuser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.Unauthorized).send({ message: "User not authorized ." });
    }
    const iUserExist = await findbrbuser({ _id: userId, status: status.ACTIVE });
    if (!iUserExist) {
      return res.status(statusCode.NotFound).send({ message: "User not Found ." });
    }
    let updateResult = await updatebrbuser({ _id: iUserExist._id }, { status: actionStatus });
    if (actionStatus === status.ACTIVE) {
      return res.status(statusCode.OK).send({ message: "User active successfully .", result: updateResult });
    } else {
      return res.status(statusCode.OK).send({ message: "User blocked successfully .", result: updateResult });
    }
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error)
  }
}
//adminLogin**********************************************************************************
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, mobileNumber, password } = req.body;
    const isAdminExist = await findUser({ $or: [{ email: email }, { mobileNumber: mobileNumber }], userType: userType.ADMIN, status: status.ACTIVE });
    if (!isAdminExist) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND })
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

//**************************Edit profile******************************************/
exports.editProfile = async (req, res, next) => {
  try {
    const { username, email, mobile_number, profilePic, } = req.body;
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
    }
    if (email || mobile_number) {
      const isSubAdminAlreadyExist = await findUser({ $or: [{ email: email }, { mobile_number: mobile_number }], _id: { $nin: isAdmin._id } });
      if (isSubAdminAlreadyExist) {
        return res.status(statusCode.Conflict).send({ message: responseMessage.USER_ALREADY_EXIST });
      }
    }
    if (profilePic) {
      profilePic = await commonFunction.getSecureUrl(profilePic);
    }
    const result = await updateUser({ _id: isAdmin._id }, req.body);
    return res.status(statusCode.OK).send({ message: responseMessage.UPDATE_SUCCESS, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}
//**************************Get all userList Admin*****************************************/

exports.getAgents = async (req, res, next) => {
  console.log("-000000000000000000");
  try {
    console.log("==================================");
    const { page, limit, usersType1, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    console.log("=---------------=-=-=>");
    const result = await paginatebrbuserSearch(req.query);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }
    console.log("result========", result);
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

//***********************************GET ALL HOTEL BOOKING LIST ****************************************/

exports.getAllHotelBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    const result = await aggregatePaginateHotelBookingList1(req.query);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

//***************************************GET ALL FLIGHT BOOKING LIST**************************************/

exports.getAllFlightBookingList = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || ""
    const aggregateQuery = [
      {
        $lookup: {
          from: "users",
          localField: 'userId',
          foreignField: '_id',
          as: "Userb2bDetails",
        }
      },
      {
        $unwind: {
          path: "$Userb2bDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: [
            { "flightName": { $regex: data, $options: "i" } },
            { "Userb2bDetails.username": { $regex: data, $options: "i" } },
            { "Userb2bDetails.email": { $regex: data, $options: "i" } },
            { "paymentStatus": { $regex: data, $options: "i" } },
            { "pnr": parseInt(data) },
          ],
        }
      },
    ]
    let aggregate = userFlightBookingModel.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 5,
    };
    const result = await userFlightBookingModel.aggregatePaginate(aggregate, options);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }

    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

//*******************************************DashBoard****************************************/

exports.adminDashBoard = async (req, res, next) => {
  try {
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    var result = {}
    result.NoOfHotelBookings = await countTotalBooking({ bookingStatus: bookingStatus.BOOKED });
    result.NoOfFlightBookings = await flightModel.countDocuments({ paymentStatus: "success" });
    result.NoOfBusBookings = await busBookingModel.countDocuments({ bookingStatus: bookingStatus.BOOKED });
    result.TotalBooking = result.NoOfHotelBookings + result.NoOfBusBookings + result.NoOfFlightBookings;
    result.NoOfSubAdmin = await countTotalUser({ userType: userType.SUBADMIN });
    result.NoOfUser = await countTotalUser({ userType: userType.USER });
    result.NoOfAgent = await countTotalbrbUser({ userType: userType.AGENT });
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

//*********************************GETALL BUSBOKING DETAILS*********************************************/

exports.getAllBusBookingList = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: 'userId',
          foreignField: '_id',
          as: "userDetails",
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: [
            { "destination": { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { "paymentStatus": { $regex: data, $options: "i" } },
            { "pnr": { $regex: data, $options: "i" } },
            { "origin": { $regex: data, $options: "i" } },
            { "dateOfJourney": { $regex: data, $options: "i" } },
            { "busType": { $regex: data, $options: "i" } },
            { "busId": parseInt(data) },
            { "name": { $regex: data, $options: "i" } },
            { "bookingStatus": { $regex: data, $options: "i" } }
          ],
        }
      },
    ]
    let aggregate = userbusBookingModel.aggregate(pipeline);
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const result = await userbusBookingModel.aggregatePaginate(aggregate, options);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}


//****************************GET SPECIFIC BOOKING DETAILS**********************************************/

exports.getDataById = async (req, res, next) => {
  const { model, id } = req.query;
  let result;
  try {
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    }
    switch (model) {
      case 'hotel':
        result = await findhotelBooking({ _id: id });
        break;
      case 'flight':
        result = await flightModel.findOne({ _id: id });
        break;
      case 'bus':
        result = await busBookingModel.findOne({ _id: id });
        break;
      case 'user':
        result = await findUser({ _id: id });
        break;
      case 'visa':
        result = await findWeeklyVisa({ _id: id });
        break;
      case 'Agent':
        result = await findUser({ _id: id });
        break;
      default:
        return res.status(400).json({ message: responseMessage.INVALID_MODEL });
    }
    console.log();
    if (!result) {
      return res.status(404).json({ message: responseMessage.DATA_NOT_FOUND });
    }

    return res.status(200).json({ message: responseMessage.DATA_FOUND, data: result });
  } catch (error) {
    console.log("error =-=-=-=-=-=-=-=-=-=-=-=-=->>", error);
    return next(error)
  }
}

//***************************************************CANCEL TICKET****************************************************/

exports.cancelTickets = async (req, res, next) => {
  try {
    const { model, ticketId } = req.body;
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    }

    switch (model) {
      case 'hotel':
        const isBookingExist = await findhotelBooking({ _id: ticketId, bookingStatus: bookingStatus.BOOKED });
        if (!isBookingExist) {
          return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
        }
        if (isBookingExist.bookingStatus == bookingStatus.CANCEL) {

        }
        result = await updatehotelBooking({ _id: id }, { bookingStatus: bookingStatus.CANCEL });
        break;
      case 'flight':
        result = await flightModel.findOne({ _id: id });
        break;
      case 'bus':
        result = await busBookingModel.findOne({ _id: id });
        break;
      case 'user':
        result = await findUser({ _id: id });
        break;
      case 'visa':
        result = await findWeeklyVisa({ _id: id });
        break;
      case 'Agent':
        result = await findUser({ _id: id });
        break;
      default:
        return res.status(statusCode.badRequest).json({ message: responseMessage.INVALID_MODEL });
    }
  } catch (error) {
    console.log("error============>>>>>>", error);
    return next(error)
  }
}

//**************************************upload profile picture*********************************************************/

exports.uploadProfilePicture = async (req, res, next) => {
  try {
    const { picture } = req.body;
    const userList = await findUser({ _id: req.userId });
    if (!userList) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
    }
    const imageUrl = await commonFunction.getSecureUrl(picture);
    if (imageUrl) {
      const result = await updateUser({ _id: userList._id }, { profilePic: imageUrl })
      return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
    }
  } catch (error) {
    console.log("error====>>>", error);
    return next(error);
  }
}

//****************************CANCEL HOTEL BOOKING AS PER USER REQUEST*************************************************/

exports.cancelHotel = async (req, res, next) => {
  try {
    const { bookingID } = req.body;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    const currentDate = new Date().toISOString();
    const isBookingExist = await findhotelBooking({ _id: bookingID, status: status.ACTIVE, CheckInDate: { $gt: currentDate } });
    if (!isBookingExist) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.NOT_FOUND })
    }
    const result = await updatehotelBooking({ _id: isBookingExist._id }, { bookingStatus: bookingStatus.CANCEL });
    await commonFunction.sendHotelBookingCancelation(isBookingExist);
    return res.status(statusCode.OK).send({ message: responseMessage.CANCELED, result: result })
  } catch (error) {
    console.log("error===========>>>.", error);
  }
}


//***********************************GET ALL AGENT HOTEL BOOKING LIST ****************************************/

exports.getAllHotelBookingListAgent = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    const result = await aggregatePaginateHotelBookingList(req.query);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

//***************************************GET ALL AGENT FLIGHT BOOKING LIST**************************************/

exports.getAllFlightBookingListAgent = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || ""
    const aggregateQuery = [
      {
        $lookup: {
          from: "userb2bs",
          localField: 'userId',
          foreignField: '_id',
          as: "Userb2bDetails",
        }
      },
      {
        $unwind: {
          path: "$Userb2bDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: [
            { "flightName": { $regex: data, $options: "i" } },
            { "Userb2bDetails.username": { $regex: data, $options: "i" } },
            { "Userb2bDetails.email": { $regex: data, $options: "i" } },
            { "paymentStatus": { $regex: data, $options: "i" } },
            { "pnr": parseInt(data) },
          ],
        }
      },
    ]
    let aggregate = flightModel.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 5,
    };
    const result = await flightModel.aggregatePaginate(aggregate, options);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }

    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

//*********************************GET ALL AGENT BUSBOKING DETAILS*********************************************/

exports.getAllBusBookingListAgent = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    // const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    // if (!isAdmin) {
    //   return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    // }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const pipeline = [
      {
        $lookup: {
          from: "userb2bs",
          localField: 'userId',
          foreignField: '_id',
          as: "userDetails",
        }
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $or: [
            { "destination": { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { "paymentStatus": { $regex: data, $options: "i" } },
            { "pnr": { $regex: data, $options: "i" } },
            { "origin": { $regex: data, $options: "i" } },
            { "dateOfJourney": { $regex: data, $options: "i" } },
            { "busType": { $regex: data, $options: "i" } },
            { "busId": parseInt(data) },
            { "name": { $regex: data, $options: "i" } },
            { "bookingStatus": { $regex: data, $options: "i" } }
          ],
        }
      },
    ]
    let aggregate = busBookingModel.aggregate(pipeline);
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const result = await busBookingModel.aggregatePaginate(aggregate, options);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}
