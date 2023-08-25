const controller = require("../controllers/bus.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Bus City List
  app.post("/travvolt/bus/citylist", controller.getBusCityList);

  //Bus Search
  app.post("/travvolt/bus/search", controller.searchBus);

  //Bus Seat Layout
  app.post("/travvolt/bus/seatlayout", controller.searchBusSeatLayout);

  //Bus Boarding Point
  app.post("/travvolt/bus/boardingpoint", controller.busBoardingPoint);

  //Bus Block
  app.post("/travvolt/bus/block", controller.busBlock);

  //Bus Book
  app.post("/travvolt/bus/book", controller.busBook);

  //Bus Booking Details
  app.post("/travvolt/bus/bookingdetails", controller.busBookingDetails);

  //Bus Cancel
  app.post("/travvolt/bus/cancel", controller.busCancellation);
};
