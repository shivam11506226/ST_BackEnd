const status = require("../../enums/status");
const Razorpay = require("razorpay");
const schemas = require("../../utilities/schema.utilities");
const commonFuction = require("../../utilities/commonFunctions");
const responseMessage = require("../../utilities/responses");
const statusCode = require("../../utilities/responceCode");

//razor pay credentials*******************************
var instance = new Razorpay({
  key_id: "rzp_test_uONAICwyPN5etQ",
  key_secret: "QnsQtx8UwN6OMd09pxSOoLru",
});
//**************************************SERVICES***************************************/
const {
  transactionModelServices,
} = require("../../services/btocServices/transactionServices");
const {
  createUsertransaction,
  findUsertransaction,
  getUsertransaction,
  deleteUsertransaction,
  userUsertransactionList,
  updateUsertransaction,
  countTotalUsertransaction,
} = transactionModelServices;

exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    var options = {
      amount: amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "rcptid_11",
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
      console.log("orderId",order.id)
      return res.status(statusCode.OK).send({responseMessage:order})
    });
  } catch (error) {
    console.log("error in create order on razorpay=====", error);
    return next(error);
  }
};

const verifySignature = async (order_id, payment_id, signature) => {
  generated_signature = hmac_sha256(
    order_id + "|" + razorpay_payment_id,
    secret
  );

  if (generated_signature == razorpay_signature) {
    console.log(" payment is successful");
  }
};
