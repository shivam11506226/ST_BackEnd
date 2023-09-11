const controller = require("../controllers/wallet.controller");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require("../utilities/schema.utilities");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post('/travvolt/wallet/add_amount',SchemaValidator(schemas.walletSchema),controller.add_amount);
  app.put(
    "/travvolt/wallet/update_amount/:id",
    SchemaValidator(schemas.addwalletAmountSchema),
    controller.update_amount
  );
  app.get("/travvolt/wallet/showWallet/:id", controller.showWallet);
  app.post(
    "/travvolt/wallet/pay_amount/:id",
    SchemaValidator(schemas.payWalletAmount),
    controller.pay_amount
  );
  app.get("/travvolt/wallet/showTransactions/:id", controller.showTransactions);
  app.post("/travvolt/wallet/rechargeWallet", controller.rechargeWallet);
};
