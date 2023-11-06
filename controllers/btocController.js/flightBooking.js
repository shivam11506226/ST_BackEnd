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

export class flightController {
  async flighBooking(req, res, next) {
    try {
      const { userId } = req.userId;
      const data = {
        ...req.body,
      };
      const isUserLogedin = await findUser({ _id: userId, status: status.ACTIVE });
      if (!isUserLogedin) {
        return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
      } else if (isUserLogedin.userType === "BLOCK") {
        return res.status(statusCode.badRequest).send({ message: responseMessage.BLOCK_USER_BY_ADMIN });
      }
      const response = await axios.post(`${api.flightBookingURL}`, data);
      return res.status(statusCode.OK).send({ message: responseMessage.FLIGHT_BOOKED, result: response.data });
    } catch (error) {
      console.log("error==========>>>>>>", error);
      return next(error);
    }
  }

  async bookFlight(req, res, next) {
    try {
      const { userId } = req.userId;
      const amount = req.body.amount;
      const isUserLogedin = await findUser({ _id: userId, status: status.ACTIVE });
      if (!isUserLogedin) {
        return res.status(statusCode.NotFound).send({ message: responseMessage.USERS_NOT_FOUND });
      }
      let instance = new Razorpay({
        key_id: process.env.Razorpay_KEY_ID,
        key_secret: process.env.Razorpay_KEY_SECRET,
      });
      var options = {
                amount: amount * 100, // amount in the smallest currency unit
                currency: "INR",
                receipt: "order_rcptid_11",
              };
              
    } catch (error) {
      console.log("error=========", error);
      return next(error);
    }
  }
  //  async rechargeWallet = (req, res) => {
  //     const amount = req.body.amount;
  //     try {
  //       let instance = new Razorpay({
  //         key_id: process.env.Razorpay_KEY_ID,
  //         key_secret: process.env.Razorpay_KEY_SECRET,
  //       });

  //       var options = {
  //         amount: amount * 100, // amount in the smallest currency unit
  //         currency: "INR",
  //         receipt: "order_rcptid_11",
  //       };
  //       console.log(amount);
  //       instance.orders.create(options, function (err, order) {
  //         if (err) {
  //           return res.send({ code: 500, message: "Server Error" });
  //         }
  //         console.log(order);
  //         return res.send({
  //           code: 200,
  //           message: "order Created Successfully",
  //           data: order,
  //         });
  //       });
  //     } catch (err) {
  //       console.log(err);
  //       sendActionFailedResponse(res, {}, err.message);
  //     }
  //   }
}
export default new flightController();