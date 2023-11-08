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
const { responseMessages } = require('../../common/const');
const {transactionModelServices}=require('../../services/btocServices/transactionServices');
const {createUsertransaction,findUsertransaction,getUsertransaction,deleteUsertransaction,userUsertransactionList,updateUsertransaction,paginateUsertransaction,countTotalUsertransaction}=transactionModelServices;
exports.transaction= async (req, res, next)=> {
    try {
        const userId=req.userId;
        const data=req.body;
        const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
        if(isUserExist){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,message:responseMessage.USERS_NOT_FOUND});
        }

    } catch (error) {
        console.log("error: " + error);
        return next(error);
    }
}

exports.userTransaction=async(req,res,next) => {
    const {amount,ticketBookingId,bookingId} = req.body.amount;
    try {
        const userId=req.userId;
        const data=req.body;
        const isUserExist = await findUser({ _id: userId, status: status.ACTIVES });
        if(isUserExist){
            return res.status(statusCode.NotFound).send({statusCode:statusCode.NotFound,message:responseMessage.USERS_NOT_FOUND});
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
      console.log(amount);
      instance.orders.create(options, function (err, order) {
        if (err) {
          return res.send({ code: 500, message: "Server Error" });
        }
        console.log(order);
        return res.send({
          code: 200,
          message: "order Created Successfully",
          data: order,
        });
      });
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
}