const controller = require("../controllers/utility.controller");
// const adminController = require("../controllers/admin.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/Login/UserLogin", controller.userLogin);
  app.post("/api/Admin/GetUserBalance", controller.getUserBalance);
  app.post("/api/PromoCode/GetPromoServices", controller.getPromoService);
  app.post("/api/PromoCode/GetPromoCode", controller.getPromoCode);
  app.post("/api/Admin/OTP", controller.getOTP);
  app.post("/api/Admin/VerifyOTP", controller.getVerifyOTP);
};
