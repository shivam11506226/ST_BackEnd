const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const agentChangeReqController=require("../controllers/b2bauth.controller")
const subAdminController=require("../controllers/subAdminController")
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
const upload=require('../utilities/uploadHandler')
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

  app.post("/skytrails/api/admin/approveAgent",SchemaValidator(schemas.approveAgentSchema),controller.approveAgent)
  app.post("/skytrails/api/user/socialLogin", SchemaValidator(schemas.socialLoginSchema),controller.socialLogin);
  app.post("/skytrails/api/admin/createSubAdmin", SchemaValidator(schemas.subAdminSchema),[authJwt.verifcationToken],subAdminController.createSubAdmin);
  app.put("/skytrails/api/admin/updateSubAdmin",upload.handleFileUpload, SchemaValidator(schemas.updateSubAdmin),[authJwt.verifcationToken],subAdminController.updateSubAdmin);
  app.delete("/skytrails/api/admin/deleteSubAdmin", SchemaValidator(schemas.updateSubAdmin),[authJwt.verifcationToken],subAdminController.deleteSubAdmin);
  app.get("/skytrails/api/admin/getSubAdmin", subAdminController.getSubAdmin);
  app.post("/skytrails/api/admin/adminLogin",SchemaValidator(schemas.adminLoginSchema),controller.adminLogin);
  app.post("/skytrails/api/admin/subAdminLogin",SchemaValidator(schemas.subAdminLogin),subAdminController.subAdminLogin);
  app.put("/skytrails/api/admin/editprofile",upload.handleFileUpload,[authJwt.verifcationToken],controller.editProfile)
  app.get("/skytrails/api/admin/getAgents", controller.getAgents);
  app.get("/skytrails/api/admin/getAllHotelBookingList",controller.getAllHotelBookingList);
  app.get("/skytrails/api/admin/getAllFlightBookingList",controller.getAllFlightBookingList);
  app.get("/skytrails/api/admin/adminDashBoard",controller.adminDashBoard);
  app.get("/skytrails/api/admin/getAllBusBookingList",controller.getAllBusBookingList);
  app.get("/skytrails/api/admin/getDataById",[authJwt.verifcationToken],controller.getDataById);
  app.put("/skytrails/api/admin/approveAgent",SchemaValidator(schemas.approveAgentSchema),controller.approveAgent)
  app.get("/skytrails/api/admin/getAllHotelBookingListAgent",controller.getAllHotelBookingListAgent);
  app.get("/skytrails/api/admin/getAllFlightBookingListAgent",controller.getAllFlightBookingListAgent);
  app.get("/skytrails/api/admin/getAllBusBookingListAgent",controller.getAllBusBookingListAgent);
  app.get("/skytrails/api/admin/getAllFixDepartureBooking", controller.getAllFixDepartureBooking);
  app.get("/skyTrails/api/admin/getchangeHotelRequestAgent",controller.getAgentchangeHotelRequest)
  app.get("/skyTrails/api/admin/getchangeFlightRequestAgent",controller.getAgentchangeFlightRequest);
  app.get("/skyTrails/api/admin/getchangeBusRequestAgent",controller.getAgentchangeBusRequest);
  app.get("/skyTrails/api/admin/getMarkup",controller.getMarkup);
  app.post("/skyTrails/api/admin/createMarkup",SchemaValidator(schemas.markupSchema),controller.createMarkup);
  app.get('/skyTrails/api/admin/getCancelUserFlightBooking',controller.getCancelUserFlightBooking);
  app.get('/skyTrails/api/admin/getCancelUserHotelBooking',controller.getCancelUserHotelBooking);
  app.get('/skyTrails/api/admin/getCancelUserBusBooking',controller.getCancelUserBusBooking);
  app.get('/skyTrails/api/admin/getCancelAgentUserFlightBooking',controller.getCancelAgentFlightBooking);
  app.get('/skyTrails/api/admin/getCancelAgentHotelBooking',controller.getCancelAgentHotelBooking);
  app.get('/skyTrails/api/admin/getCancelAgentBusBooking',controller.getCancelAgentBusBooking);
  app.get('/skyTrails/api/admin/getSearchHistory',controller.getSearchHistory);
};
