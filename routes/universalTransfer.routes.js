const controller = require("../controllers/universaltransfer.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post("/travvolt/universaltransfer/staticData", controller.staticData);
  app.post(
    "/travvolt/universaltransfer/GetDestinationSearchStaticDatacitywise",
    controller.GetDestinationSearchStaticDatacitywise
  );
  app.post(
    "/travvolt/universaltransfer/GetDestinationSearchStaticDataHotelwise",
    controller.GetDestinationSearchStaticDataHotelwise
  );
  app.post(
    "/travvolt/universaltransfer/GetTransferStaticData",
    controller.GetTransferStaticData
  );
  app.post(
    "/travvolt/universaltransfer/transfersearch",
    controller.transfersearch
  );
  app.post(
    "/travvolt/universaltransfer/GetCancellationPolicy",
    controller.GetCancellationPolicy
  );
  app.post("/travvolt/universaltransfer/booking", controller.booking);
  app.post(
    "/travvolt/universaltransfer/GenerateVoucher",
    controller.GenerateVoucher
  );
  app.post(
    "/travvolt/universaltransfer/retrieveBookingDetails",
    controller.retrieveBookingDetails
  );
  app.post(
    "/travvolt/universaltransfer/SendChangeRequest",
    controller.SendChangeRequest
  );
  app.post(
    "/travvolt/universaltransfer/getcancleRequeststatus",
    controller.getcancleRequeststatus
  );
};
