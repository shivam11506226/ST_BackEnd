const db = require("../model");
const b2bUser = db.userb2b;
const mongoose=require('mongoose')
var bcrypt = require("bcryptjs");
const wallet = require('../model/wallet.model');
const User = require('../model/user.model');
const Role = require('../model/role.model');
const Razorpay = require("razorpay");
const config = require("../config/auth.config");
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
const { aggregatePaginateHotelBookingList, findhotelBooking, findhotelBookingData, deletehotelBooking, updatehotelBooking, hotelBookingList, countTotalBooking, aggregatePaginateHotelBookingList1 } = hotelBookingServicess;
const { createUser, findUser, getUser, findUserData, updateUser, paginateUserSearch, countTotalUser } = userServices;
const { visaServices } = require('../services/visaServices');
const { createWeeklyVisa, findWeeklyVisa, deleteWeeklyVisa, weeklyVisaList, updateWeeklyVisa, weeklyVisaListPaginate } = visaServices;
//***************************Necessary models**********************************/
const flightModel = require('../model/flightBookingData.model')
const hotelBookingModel = require('../model/hotelBooking.model')
const busBookingModel = require("../model/busBookingData.model");

const aws = require("aws-sdk");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

// Set up AWS S3 client
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
});

exports.RegisterUser = async (req, res) => {
  // Upload image to S3
  const reqData = JSON.parse(req.body.data);
  const file = req?.file;
  var salt = bcrypt.genSaltSync(10);
  console.log(reqData.personal_details.password);
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  s3.upload(s3Params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Save user to database
      const user = new b2bUser({
        personal_details: {
          ...reqData.personal_details,
          mobile: {
            country_code: "+91",
            mobile_number: reqData.personal_details.mobile.mobile_number,
          },
          password: bcrypt.hashSync(reqData.personal_details.password, salt),
        },
        agency_details: {
          ...reqData.agency_details,
          agency_mobile: {
            country_code: "+91",
            mobile_number: reqData.agency_details.agency_mobile.mobile_number,
          },
          document_details: {
            pan_card_document: data.Location,
          },
        },
        agency_gst_details: {
          ...reqData.agency_gst_details,
        },
      });

      try {
        var size = Object.keys(user).length;
        if (size > 0) {
          const walletdata = await wallet.create({ userId: user._id.toString(), currency: reqData.currency, status: "successful" });
          user.walletid = walletdata._id.toString();
        }
        const response = await user.save();
        msg = "Data Saved Successfully";
        actionCompleteResponse(res, response, msg);
      } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
      }
    }
  });
};

// exports.LoginUser = async (req, res) => {
//   b2bUser
//     .findOne({ "personal_details.email": req.body.email })
//     .exec((err, user) => {
//       if (err) {
//         console.log(err);
//         sendActionFailedResponse(res, {}, err.message);
//       }

//       if (!user) {
//         const msg = "User Not found.";
//         sendActionFailedResponse(res, {}, msg);
//       }

//       if (user?.is_active == 0) {
//         const msg = "User Disabled Please Contact your Administrator";
//         sendActionFailedResponse(res, {}, msg);
//       } else if (user?.is_active == 1) {
//         var passwordIsValid = bcrypt.compareSync(
//           req.body.password,
//           user?.personal_details?.password
//         );

//         if (!passwordIsValid) {
//           // return res.status(401).send({ message: "Invalid Password!" });
//           const msg = "Invalid Password!";
//           sendActionFailedResponse(res, {}, msg);
//         }
//         const response = {
//           id: user._id,
//           username: user?.personal_details?.first_name,
//           email: user?.personal_details?.email,
//           balance: user?.balance,
//           markup: user?.markup
//         };
//         msg = "User Login Successfully!";
//         actionCompleteResponse(res, response, msg);
//       }
//     });
// };

exports.LoginUser = async (req, res) => {
  try {
    const user = await b2bUser.findOne({ "personal_details.email": req.body.email });

    if (!user) {
      const msg = "User Not found.";
      return sendActionFailedResponse(res, {}, msg);
    }

    if (user.is_active === 0) {
      const msg = "User Disabled. Please Contact your Administrator";
      return sendActionFailedResponse(res, {}, msg);
    } else if (user.is_active === 1) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user?.personal_details?.password
      );

      if (!passwordIsValid) {
        const msg = "Invalid Password!";
        return sendActionFailedResponse(res, {}, msg);
      }

      const response = {
        id: user._id,
        username: user?.personal_details?.first_name,
        email: user?.personal_details?.email,
        balance: user?.balance,
        markup: user?.markup
      };
      const msg = "User Login Successfully!";
      return actionCompleteResponse(res, response, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.error(error);
  }

}

exports.UserUpdate = async (req, res) => {
  try {
    let { user_id, is_active } = req.body;
    let findCri = {
      _id: user_id,
    };
    let updateCri = {
      is_active: is_active,
    };

    await b2bUser.findOneAndUpdate(findCri, updateCri, { new: true });
    msg = "Status has been updated successfully";
    let resData = {
      updateCri,
    };
    actionCompleteResponse(res, resData, msg);
  } catch (error) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findById(req.body.isAdmin);
    const role = await Role.findById(user.roles[0].toString());
    if (role.name === 'admin') {
      const response = await b2bUser.findByIdAndDelete(userId);
      // console.log(response.walletid.toString());
      await wallet.findByIdAndDelete(response.walletid.toString());
      const msg = "user deleted successfully"
      actionCompleteResponse(res, {}, msg);
    }
    else {
      const msg = "only Admin can delete b2b users "
      actionCompleteResponse(res, {}, msg);
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
}

exports.Getallusers = async (req, res) => {
  try {
    const users = await b2bUser.find();
    msg = "User Fetched";
    actionCompleteResponse(res, users, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.SetMarkup = async (req, res) => {
  try {
    const { userId } = req.body; //destructure userId and amount from request body
    //check if userId is valid in table
    const resData = await b2bUser.findById(userId);
    console.log(resData);
    const user = await b2bUser.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          markup: {
            bus: req.body.markup.bus || resData.markup.bus,
            hotel: req.body.markup.hotel || resData.markup.hotel,
            flight: req.body.markup.flight || resData.markup.flight,
            holiday: req.body.markup.holiday || resData.markup.holiday
          }
        }
      },
      { new: true }
    );
    if (!user) {
      msg = "Invalid userId";
      sendActionFailedResponse(res, {}, msg);
    }
    msg = "Amount updated successfully";
    actionCompleteResponse(res, user, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
    console.log(error);
  }
};

exports.GetMarkup = async (req, res) => {
  try {
    const { userId } = req.params; //destructure userId from request params
    const user = await b2bUser.findOne({ _id: userId }, "markup");
    if (!user) {
      sendActionFailedResponse(res, {}, "Invalid userId");
    } else {
      actionCompleteResponse(res, user, "Markup amount retrieved successfully");
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }
};

//update b2b balance using razorpay
exports.updateUserBalance = async (req, res) => {

  try {
    const { _id, amount } = req.body; // Destructure userId and additionalBalance from the request body

    // Check if userId is valid in your user table
    console.log(req.body);


    let instance = new Razorpay({
      key_id: process.env.Razorpay_KEY_ID,
      key_secret: process.env.Razorpay_KEY_SECRET,
    });

    var options = {
      amount: Number(req.body.amount) * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    console.log(req.body.amount);
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.error(err);
        return res.status(500).json({ code: 500, message: "Server Error" });
      }

      console.log(order);
      // return res.send({
      //   code: 200,
      //   message: "order Created Successfully",
      //   data: order,
      // });
    });
    const user = await b2bUser.findById(_id);

    if (!user) {
      return sendActionFailedResponse(res, {}, "Invalid userId");
    }

    // Update the user's balance by adding the additional balance
    user.balance += Number(amount);

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user object
    actionCompleteResponse(res, updatedUser, "User balance updated successfully");

  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }

};

exports.payVerify = (req, res) => {
  try {
    console.log(req.body);
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', process.env.Razorpay_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);

    if (expectedSignature === req.body.razorpay_signature) {
      console.log("Payment Success");
    } else {
      console.log("Payment Fail");
    }

  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error.message);
  }
}



// get userById

exports.UserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Query MongoDB to find a user by userId
    const user = await b2bUser.findById(userId).select('-personal_details.password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    actionCompleteResponse(res, user, "User Found");

  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }
}


//change password

exports.UserChangePassword = async (req, res) => {
  try {
    const { _id, oldpassword, changepassword, confirmpassword } = req.body;
    const user = await b2bUser.findById(_id);

    if (!user) {
      return sendActionFailedResponse(res, {}, "User not found");
    }

    // Check if the old password matches the stored password
    const isPasswordValid = await bcrypt.compare(oldpassword, user.personal_details.password);

    if (!isPasswordValid) {
      return sendActionFailedResponse(res, {}, "Old password is incorrect");
    }

    // Check if the new password and confirmation match
    if (changepassword !== confirmpassword) {
      return sendActionFailedResponse(res, {}, "New password and confirmation do not match");
    }

    // Hash the new password before updating it
    const hashedPassword = await bcrypt.hash(changepassword, 10); // You can adjust the salt rounds as needed

    // Update the user's password field (assuming it's under personal_details)
    user.personal_details.password = hashedPassword;
    const updaeUser = await user.save();

    // Send a success response
    return actionCompleteResponse(res, updaeUser, { message: "Password updated successfully" });

  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }
}


exports.agentQues = async (req, res, next) => {
  try {
    // const{userId}=req.userId;
    // const {userId}=req.body;
    const { page, limit, search, userId } = req.query;
    const isUSerExist = await findUser({ _id: userId });
    if (!isUSerExist) {
      return res.status(statusCode.NotFound).send(responseMessage.AGENT_NOT_FOUND);
    }
    const hotelData = await aggregatePaginateHotelBookingList(req.query);
    console.log("hotelData============", busBookData);
    if (search) {
      var filter = search;
    }
    let data = filter || "";
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
        $project: {
          "userDetails.username": 1,
          "userDetails.email": 1,
          "userDetails.userType": 1,
          "flightName": 1,
          "paymentStatus": 1,
          "pnr": 1,
          "transactionId": 1,
          "transactionId": 1,
          "country": 1,
          "city": 1,
          "address": 1,
          "gender": 1,
          "firstName": 1,
          "lastName": 1,
          "userId": 1,
          "_id": 1,
          "phone": 1
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
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 5,
    };
    const flightData = await flightModel.aggregatePaginate(aggregate, options);
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
    console.log("flightData=========", flightData);
    let aggregate1 = busBookingModel.aggregate(pipeline);
    const options1 = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const busBookData = await busBookingModel.aggregatePaginate(aggregate1, options1);
    const combinedData = [hotelData, flightData, busBookData];
    console.log("busBookData===========", busBookData);
    return res.status(statusCode.OK).send({ message: responseMessage.DATA_FOUND, result: combinedData });

  } catch (error) {
    console.log("error==============", error);
    return next(error);
  }
}


//subtract Balance

exports.subtractBalance = async (req, res) => {
  try {
    const { _id, amount } = req.body;

    const user = await b2bUser.findById(_id);

    if (!user) {
      return sendActionFailedResponse(res, {}, "Invalid userId");
    }

    // Update the user's balance by subtracting balance
    user.balance -= Number(amount);

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user object
    actionCompleteResponse(res, updatedUser, "User balance updated successfully");

  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }
}


//***********************************GET ALL HOTEL BOOKING LIST ****************************************/

exports.getAllAgentHotelBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, fromDate, toDate, userId } = req.query;
    const isAgent = await findUser({_id: userId});
    if (!isAgent) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.USERS_NOT_FOUND });
    }
    const result = await aggregatePaginateHotelBookingList1(req.query);
    if (result.docs.length == 0) {
      return res.status(statusCode.NotFound).send({ statusCode: statusCode.NotFound, message: responseMessage.DATA_NOT_FOUND });
    }
    return res.status(statusCode.OK).send({ statusCode: statusCode.OK, message: responseMessage.DATA_FOUND, result: result });
  } catch (error) {
    console.log("error=======>>>>>>", error);
    return next(error);
  }
}

//***************************************GET ALL FLIGHT BOOKING LIST**************************************/

exports.getAllAgentFlightBookingList = async (req, res, next) => {
  try {
    const { page, limit, search, userId } = req.query;
    const isAgent = await findUser({ _id: userId});
    if (!isAgent) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
    }
    if (search) {
      var filter = search;
    }
    let data = filter || ""
    const aggregateQuery = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId)
        }
      },
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
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
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

//*********************************GETALL BUSBOKING DETAILS*********************************************/

exports.getAllAgentBusBookingList = async (req, res, next) => {
  try {
    const { page, limit, search,userId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: 'Invalid userId' });
    }

    const isAgent = await findUser({ _id: userId});
    if (!isAgent) {
      return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
    }
    if (search) {
      var filter = search;
    }
    let data = filter || "";
    const pipeline = [
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId)
        },
      },
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


//*****************************************CANCEL BOOKINGS BY AGENT*********************************************/

exports.cancelBookingByAgent = async (req, res, next) => {
  try {
    const {}=req.body;
  } catch (error) {
    console.log("error", error);
    return next(error);
  }
}