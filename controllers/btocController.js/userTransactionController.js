const responseMessage = require('../../utilities/responses');
const statusCode = require('../../utilities/responceCode')
const status = require("../../enums/status");
const Razorpay = require("razorpay");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
const bcrypt = require("bcryptjs");
const axios = require('axios');
const crypto=require('crypto')
//razor pay instance******************************************
let instance = new Razorpay({
  key_id: process.env.Razorpay_KEY_ID,
  key_secret: process.env.Razorpay_KEY_SECRET,
});

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
    const {amount,flightBookingId,busBookingId,hotelBookingId,paymentId} = req.body.amount;
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


exports.makePayment=async(req,res,next)=>{
  try {
    const { bookingType, amount } = req.body;
    const isUserExist = await findUserData({
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
    var options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
      partial_payment:true
    };
    const razorpayOrder = await  instance.orders.create(options);

    // Log the order details for debugging
    console.log("Razorpay Order:", razorpayOrder);

  //   const transactionData={
  //     userId:isUserExist._id,
  //     orderId:razorpayOrder.id,
  //     amount:amount,
  //     bookingType:bookingType
  //   };
  //  const result= await createUsertransaction(transactionData);

  res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.PAYMENT_SUCCESS,result:razorpayOrder});
  } catch (error) {
    console.log("error in transaction===========",error);
    return  next(error)
  }
}



exports.payVerify =async(req,res,next)=>{
  try {
    const {orderID,paymentId,signature}=req.body;
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    const isUserExist = await findUserData({
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
    var expectedSignature = crypto.createHmac('sha256',process.env.Razorpay_KEY_SECRET).update(body.toString()).digest('hex');
    const isAuth=expectedSignature===signature;
    if(isAuth){
      // await instance.paymentLink.create({orderID,paymentId,signature});
      const transactionData={
        userId:isUserExist._id,
        orderId:razorpayOrder.id,
        amount:amount,
        paymentId:paymentId,
        signature:signature,
        bookingType:bookingType
      };
     const result= await createUsertransaction(transactionData);
      res.redirect(`http://localhost:8000/paymentsuccess?reference=${paymentId}`)
    }
   
  } catch (error) {
    console.log("Error in payment verification=>>",error.message);
    return next(error)
  }
}

// exports.paymentUrl=async(req,res,next)=>{
//   try {
//     const {amount,name,email,contact,policyName}=req.body;
//     const orderData = {
//       amount: amount,
//       currency: "INR",
//       accept_partial: true,
//       first_min_partial_amount: 100,
//       description: "For payment purpose",
//       customer: {
//         name: name,
//         email:email,
//         contact: contact
//       },
//       notify: {
//         sms: true,
//         email: true,
//         whatsapp:true
//       },
//       reminder_enable: true,
//       notes: {
//         policy_name: policyName||"payment for bookings",
//       },
//     };
//     const response = await instance.paymentLink.create(orderData);
//     console.log("response=>>>>>>>>>>>>>>>", response);
//     console.log("Entire Response: ", JSON.stringify(response, null, 2));
//     let paymentLink = response.short_url;
//     if (!paymentLink) {
//       console.error("Payment link not found in the response");
//       res.status(statusCode.InternalError).send({statusCode:statusCode.InternalError,responseMessage:"Payment link not found",result:paymentLink})
//     }
//     console.log("paymentLink==============", paymentLink);
//     res.status(statusCode.OK).send({statusCode:statusCode.OK,responseMessage:responseMessage.PAYMENT_SUCCESS,result:paymentLink});
//   } catch (error) {
//     console.error("Error creating url:", error);
//     // res.status(500).json({ error: error.message, razorpayError: error.response.data });
//     return next(error)
    
//   }
// }

exports.paymentUrl = async (req, res, next) => {
  try {
    const { amount, name, email, contact, policyName } = req.body;

    const orderData = {
      amount: amount,
      currency: "INR",
      accept_partial: true,
      first_min_partial_amount: 100,
      description: "For payment purpose",
      customer: {
        name: name,
        email: email,
        contact: contact,
      },
      notify: {
        sms: true,
        email: true,
        whatsapp: true,
      },
      reminder_enable: true,
      notes: {
        policy_name: policyName || "payment for bookings",
      },
    };

    const response = await instance.paymentLink.create(orderData);
    console.log("Entire Response: ", JSON.stringify(response, null, 2));

    let paymentLink = response.short_url;
    if (!paymentLink) {
      console.error("Payment link not found in the response");
      return res
        .status(statusCode.InternalError)
        .send({
          statusCode: statusCode.InternalError,
          responseMessage: "Payment link not found",
          result: paymentLink,
        });
    }

    console.log("paymentLink==============", paymentLink);
    
    // In a real-world scenario, you would save the payment link or associated order details in your database.

    return res
      .status(statusCode.OK)
      .send({
        statusCode: statusCode.OK,
        responseMessage: responseMessage.PAYMENT_SUCCESS,
        result: paymentLink,
      });
  } catch (error) {
    console.error("Error creating url:", error);
    if (error.response && error.response.data) {
      console.error("Razorpay Error Details:", error.response.data);
    }
    return next(error);
  }
};





// Function to create a Razorpay order
const createRazorpayOrder = (orderOptions) => {
  return new Promise((resolve, reject) => {
    instance.orders.create(orderOptions, (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        reject(err);
      } else {
        resolve(order);
      }
    });
  });
};