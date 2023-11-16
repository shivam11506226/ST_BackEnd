const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
const controller = require('../controllers/userController')
const userController = require('../controllers/btocController.js/controller')
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/skytrails/api/user/mobileLogin", SchemaValidator(schemas.btoCuserLoginSchema), userController.login)
  app.post("/skytrails/api/user/signUp", SchemaValidator(schemas.userSignupSchema), controller.signUp);
  app.post("/skytrails/api/user/verifyOtp", SchemaValidator(schemas.userVerifySchema), controller.verifyOtp);
  app.post("/skytrails/api/user/login", SchemaValidator(schemas.userLoginSchema), controller.login)
  app.post("/skytrails/api/user/forgetPassword", SchemaValidator(schemas.userForgetSchema), controller.forgetPassword);
  app.put("/skytrails/api/user/verifyUserOtp", SchemaValidator(schemas.userVerifySchema), [authJwt.verifcationToken], userController.verifyUserOtp)
  app.put("/skytrails/api/user/resendOtp", SchemaValidator(schemas.btoCuserLoginSchema), userController.resendOtp);
  app.get("/skytrails/api/user/getUserProfile", [authJwt.verifcationToken], userController.getUserProfile)
  app.put('/skytrails/api/user/uploadImage', [authJwt.verifcationToken], userController.uploadImage)








}