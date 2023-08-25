const controller = require("../controllers/hotel.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  //Hotel Search De Dup
  app.post("/travvolt/hotel/search/dedup", controller.searchHotelDeDup);

  //Hotel Search
  app.post("/travvolt/hotel/search", controller.searchHotel);

  //Hotel Search Info De Duplicate
  app.post("/travvolt/hotel/searchinfo/dedup", controller.searchHotelInfoDeDup);

  //Hotel Search Info
  app.post("/travvolt/hotel/searchinfo", controller.searchHotelInfo);

  //Hotel Room
  app.post("/travvolt/hotel/room", controller.searchHotelRoom);

  //Hotel Room De Duplicate
  app.post("/travvolt/hotel/room/dedup", controller.searchHotelRoomDeDup);

  //Hotel Block Room
  app.post("/travvolt/hotel/blockroom", controller.searchHotelBlockRoom);

  //Hotel Block Room De Duplicate
  app.post(
    "/travvolt/hotel/blockroom/dedup",
    controller.searchHotelBlockRoomDeDup
  );

  //Hotel Book Room
  app.post("/travvolt/hotel/bookroom", controller.searchHotelBookRoom);

  //Hotel Book Room De Duplicate
  app.post(
    "/travvolt/hotel/bookroom/dedup",
    controller.searchHotelBookRoomDeDup
  );

  //Hotel Booking Details
  app.post(
    "/travvolt/hotel/bookingdetails",
    controller.searchHotelBookingDetails
  );

  //Hotel Send Cancel Request
  app.post("/travvolt/hotel/cancel", controller.hotelSendCancel);

  //Hotel Get Cancel Request Status
  app.post("/travvolt/hotel/cancel/status", controller.hotelGetCancelStatus);

  //Hotel Get Cancel Request Status
  app.post(
    "/travvolt/hotel/getagencybalance",
    controller.hotelGetAgencyBalance
  );

  //Hotel Country List
  app.post("/travvolt/hotel/getcountrylist", controller.hotelGetCountryList);

  //Hotel Destination CityList
  app.post(
    "/travvolt/getdestinationcitylist",
    controller.hotelGetDestinationCityList
  );

  //Hotel Top Destination List
  app.post(
    "/travvolt/hotel/gettopdestinationlist",
    controller.hotelGetTopDestinationList
  );

  //Hotel Voucher
  app.post("/travvolt/hotel/getvoucher", controller.hotelGetVoucher);
};
