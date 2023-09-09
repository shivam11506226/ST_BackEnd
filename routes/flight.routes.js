const controller = require("../controllers/flight.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Airport Data
  app.get(
    "/travvolt/getSearchAirportData/:key",
    controller.getSearchAirportData
  );
  app.post("/travvolt/airportData", controller.airportData);

  //Token Generator
  app.post("/travvolt/token", controller.tokenGenerator);

  //Logout
  app.post("/travvolt/logout", controller.logout);

  //One Way Search
  app.post("/travvolt/flight/search/oneway", controller.searchOneWay);

  //emt fligt search Routes------------------start

  app.post("/emt/flight/search/oneway", controller.onewaySearch);

  //-------------Two way flight Search-----------------------

  app.post("/emt/flight/search/twoway", controller.twowaySearch);

  app.post("/emt/flight/search/discount", controller.twowaySearch);

  //--------------END--------------

  //Return Search
  app.post("/travvolt/flight/search/return", controller.searchReturn);

  //Multi City Search
  app.post("/travvolt/flight/search/multicity", controller.searchMultiCity);

  //AdvanceSearch
  app.post("/travvolt/flight/search/advance", controller.searchAdvance);

  //SpecialReturn Search
  app.post(
    "/travvolt/flight/search/specialreturn",
    controller.searchSpecialReturn
  );

  //FareRule Search
  app.post("/travvolt/flight/farerule", controller.fareRule);

  //FareQuote Search
  app.post("/travvolt/flight/farequote", controller.fareQuote);

  //SSR Pending

  //Booking Non LCC FLights
  app.post("/travvolt/flight/booking", controller.bookingFLight);

  //Booking EMT flights  Routes ---------------start--------

  app.post("/emt/flight/bookingRequest", controller.emtbookingFLightRequest);

  app.post("/GetSeatMap", controller.getSeatMap);

  app.post("/AirRePriceRQ", controller.emtFlightPrice);

  app.post("/BookFlight", controller.emtFlightBook);

  // app.get("/single/flight/combined/response",controller.combinedSearch);

  //Get Ticket LCC
  app.post("/travvolt/flight/getticketlcc", controller.getTicketLCC);

  //Get Ticket Non LCC with passport
  app.post(
    "/travvolt/flight/getticketnonlccpass",
    controller.getTicketNonLCCpass
  );

  //Get Ticket Non LCC without passport
  app.post("/travvolt/flight/getticketnonlcc", controller.getTicketNonLCC);

  //GetBookingDetails Request-1 BookingId, PNR
  app.post("/travvolt/flight/getbookingdetails", controller.getBookingDetails);

  //ReleasePNRRequest
  app.post(
    "/travvolt/flight/releasepnrrequest",
    controller.getReleasePNRRequest
  );

  //SendChangeRequest
  app.post(
    "/travvolt/flight/sendchangerequest",
    controller.getSendChangeRequest
  );

  //GetChangeRequestStatus
  app.post(
    "/travvolt/flight/getchangerequeststatus",
    controller.getChangeRequestStatus
  );

  //GetCancellationCharges
  app.post(
    "/travvolt/flight/getcancellationcharges",
    controller.getGetCancellationCharges
  );

  // payment

  app.post("/travvolt/flight/paymentFlight", controller.paymentFlight);
  // app.post("/travvolt/flight/verifyPayment", controller.verifyPayment);
};
