const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const subAdminController=require("../controllers/subAdmin")
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  
  app.post("/skytrails/api/user/socialLogin", SchemaValidator(schemas.socialLoginSchema),controller.socialLogin);
  app.post("/skytrails/api/admin/createSubAdmin", SchemaValidator(schemas.subAdminSchema),[authJwt.verifcationToken],subAdminController.createSubAdmin);
  app.put("/skytrails/api/admin/updateSubAdmin", SchemaValidator(schemas.updateSubAdmin),[authJwt.verifcationToken],subAdminController.updateSubAdmin);
  app.delete("/skytrails/api/admin/deleteSubAdmin", SchemaValidator(schemas.updateSubAdmin),[authJwt.verifcationToken],subAdminController.deleteSubAdmin);
  app.get("/skytrails/api/admin/getSubAdmin",[authJwt.verifcationToken], subAdminController.getSubAdmin);
  app.post("/skytrails/api/admin/adminLogin",SchemaValidator(schemas.adminLoginSchema),controller.adminLogin)
  app.post("/skytrails/api/admin/subAdminLogin",SchemaValidator(schemas.subAdminLogin),subAdminController.subAdminLogin)
};
