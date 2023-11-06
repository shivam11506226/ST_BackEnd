const controller = require("../controllers/b2bauth.controller");
const multer = require("multer");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/skyTrails/b2b/register", upload.single("file"), controller.RegisterUser);
  app.post("/skyTrails/b2b/login", controller.LoginUser);
  app.post("/skyTrails/user/update", controller.UserUpdate);
  app.delete("/skyTrails/user/delete", controller.deleteUser);
  app.get("/skyTrails/user/getallusers", controller.Getallusers);
  app.post("/skyTrails/user/setmarkup", controller.SetMarkup);
  app.get("/skyTrails/user/getmarkup/:userId", controller.GetMarkup);
  app.get("/skytrails/user/agentQueues", controller.agentQues)
  app.get("/skytrails/user/getAllAgentHotelBookingList",SchemaValidator(schemas.agetHotelBooking), controller.getAllAgentHotelBookingList);
  app.get("/skytrails/user/getAllAgentFlightBookingList",SchemaValidator(schemas.agetHotelBooking), controller.getAllAgentFlightBookingList);
  app.get("/skytrails/user/getAllAgentFlightBookingList",SchemaValidator(schemas.agetHotelBooking), controller.getAllAgentBusBookingList);
  //get singleuserbyid
  app.get("/skyTrails/user/:userId", controller.UserById);

  //update password user by id

  app.patch("/skyTrails/user/changepassword", controller.UserChangePassword);

  //update balance route
  app.post("/updateBalance", controller.updateUserBalance);
  //veryfiyrazorPay

  app.post('/payVerify', controller.payVerify);

  //subtractBalance
  app.post("/skyTrails/subtractBalance", controller.subtractBalance);


};
