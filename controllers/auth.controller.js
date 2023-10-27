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
const { createUser, findUser, getUser, findUserData, updateUser } = userServices;


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
    const isAdminExist = await findUser({ $or: [{ email: email }, { mobileNumber: mobileNumber }],userType:userType.ADMIN,status:status.ACTIVE });
    if (!isAdminExist) {
      return res.status(statusCode.NotFound).send({message:responseMessage.ADMIN_NOT_FOUND})
    }
    const isMatched =  bcrypt.compareSync(password,isAdminExist.password);
    if (!isMatched) {
      return res.status(statusCode.badRequest).send({message:responseMessage.INCORRECT_LOGIN})
    }
    const token = await commonFunction.getToken({
      id: isAdminExist._id,
      email: isAdminExist.email,
      userType: isAdminExist.userType,
    });
    const result={
      token,isAdminExist
    }
    return res.status(statusCode.OK).send({message:responseMessage.LOGIN,result:result});
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error)
  }
}

