const controller = require("../controllers/city.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  // app.post('/travvolt/city/addData',controller.addData);searchCityBusData
  app.get("/travvolt/city/searchCityData", controller.searchCityData);
  app.get("/travvolt/city/searchCityBusData", controller.searchCityBusData);
  app.post("/travvolt/city/hotelCitySearch", controller.hotelCitySearch);
};
