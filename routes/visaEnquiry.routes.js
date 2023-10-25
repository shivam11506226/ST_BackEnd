const controller = require("../controllers/visaEnquiry.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/travvolt/visa/createVisaEnquiry", controller.createVisaEnquiry);
  app.get("/travvolt/visa/getAllVisaEnquiry", controller.getAllVisaEnquiry);

  //delete  by id
  app.delete("/travvolt/deleteVisaEnquiry/:id", controller.deleteVisaEnquiry);
};
