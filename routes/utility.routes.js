const controller = require("../controllers/utility.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  
  app.post("/api/Login/UserLogin", controller.userLogin);

  app.post("/api/Recharge/GetService",controller.getService);


  app.post("/api/Recharge/GetRechargePlan",controller.getRechargePlan);



  app.post("/api/Recharge/GetRechargePlanDetail",controller.getRechargePlanDetails);



  app.post("/api/Recharge/Recharge/",controller.rechageRequest);











}