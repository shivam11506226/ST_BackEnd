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
const responseMessage = require('../utilities/responses')
//***********************************SERVICES********************************************** */

const { userServices } = require('../services/userServices');
const userType = require("../enums/userType");
const status = require("../enums/status");
const { hotelBookingServicess } = require("../services/hotelBookingServices");
const { aggregatePaginateHotelBookingList, hotelBookingList,countTotalBooking } = hotelBookingServicess;
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch,countTotalUser } = userServices;

//***************************Necessary models**********************************/
const flightModel = require('../model/flightBookingData.model')
const hotelBookingModel = require('../model/hotelBooking.model')
const busBookingModel = require("../model/busBookingData.model");
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
    const { userId, approveStatus } = req.body;
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.Unauthorized).send({ message: responseMessage.UNAUTHORIZED });
    }
    const iUserExist = await findUser({ _id: userId, status: status.ACTIVE });
    if (!iUserExist) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.USER_NOT_FOUND });
    }
    let updateResult = await updateUser({ _id: iUserExist._id }, { approveStatus: approveStatus, isApproved: true });
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
    const result = await updateUser({ _id: subAdminId }, req.body);
    return res.status(statusCode.OK).send({ message: responseMessage.UPDATE_SUCCESS, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}
//**************************Get all userList Admin*****************************************/

exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, usersType, search } = req.query;
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    }
    const result = await paginateUserSearch(req.query);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.DATA_NOT_FOUND });
    }
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
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    }
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

//***************************************GET ALL FLIGHT BOOKING LIST**************************************/

exports.getAllFlightBookingList = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    }
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
            { "flightName": { $regex: data, $options: "i" } },
            { "userDetails.username": { $regex: data, $options: "i" } },
            { "userDetails.email": { $regex: data, $options: "i" } },
            { "paymentStatus": { $regex: data, $options: "i" } },
            { "pnr": parseInt(data) },
          ],
        }
      },
    ]
    let aggregate = flightModel.aggregate(aggregateQuery);
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
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

//*******************************************DashBoard****************************************/

exports.adminDashBoard = async (req, res, next) => {
  try {
    const isAdmin = await findUser({ _id: req.userId, userType: userType.ADMIN });
    if (!isAdmin) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.ADMIN_NOT_FOUND });
    }
    var result={}
    result.noOfHotelBookings=await countTotalBooking({bookingStatus:bookingStatus.BOOKED});
    result.noOfUser=await countTotalUser({userType:userType.USER});
    result.noOfFlightBookings=await flightModel.countDocuments({paymentStatus:"success"});
    result.noOfBusBookings=await busBookingModel.countDocuments({bookingStatus:bookingStatus.BOOKED});
    result.noOfSubAdmin=await countTotalUser({userType:userType.SUBADMIN});
    result.noOfAgent=await countTotalUser({userType:userType.AGENT});
    result.totalBooking= result.noOfHotelBookings+result.noOfBusBookings+result.noOfFlightBookings;
    console.log("result========",result);
    console.log();
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

