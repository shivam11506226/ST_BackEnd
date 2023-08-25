const controller = require("../controllers/sightsetting.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
 
  app.post("/travvolt/sightSetting/sightSettingSearch", controller.sightSettingSearch);
  app.post("/travvolt/sightSetting/sightSettingGetavailability", controller.sightSettingGetavailability);
  app.post("/travvolt/sightSetting/sightSettingBlock", controller.sightSettingBlock);
  app.post("/travvolt/sightSetting/sightSettingBook", controller.sightSettingBook);
  app.post("/travvolt/sightSetting/sightSettingBookingDetail", controller.sightSettingBookingDetail);
  app.post("/travvolt/sightSetting/sightSettingBookingChangeRequest", controller.sightSettingBookingChangeRequest);
  
};
