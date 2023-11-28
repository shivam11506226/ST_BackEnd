const busBookingController = require('../../controllers/btocController.js/busBookingController');
const flightBookingController=require('../../controllers/btocController.js/flightBookingController');
const hotelBookingController=require('../../controllers/btocController.js/hotelBookingController');
const advertisementController=require('../../controllers/btocController.js/advertisementController');
const userCancelController=require('../../controllers/btocController.js/cancelTicketController');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
const { authJwt } = require("../../middleware");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    // SchemaValidator(schemas.userbusBookingSchema),   SchemaValidator(schemas.userflightBookingSchema),  ,SchemaValidator(schemas.userhotelBookingSchema) 
    app.post('/skyTrails/api/user/busBooking',[authJwt.verifcationToken], busBookingController.busBooking);
    app.post('/skyTrails/api/user/flightBooking',[authJwt.verifcationToken],flightBookingController.flighBooking)
    app.post('/skyTrails/api/user/hotelBooking',[authJwt.verifcationToken], hotelBookingController.hotelBooking);
    // app.put('/skyTrails/api/user/', controller.updatePost);
    // app.delete('/skyTrails/api/user/', controller.deletePost);
    app.get('/skyTrails/api/user/getUserflightBooking',[authJwt.verifcationToken],flightBookingController.getUserflightBooking);
    app.get('/skyTrails/api/user/getUserFlightData',[authJwt.verifcationToken],flightBookingController.getUserFlightData);
    app.post('/skyTrails/api/createadvertisment',[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createadvertismentController);
    app.put('/skyTrails/api/updateadvertisement',[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updateadvertisementController);
    app.get('/skyTrails/api/getadvertisement',advertisementController.getadvertisementController);
    app.post('/skyTrails/api/createflightadvertisment',[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createflightadvertismentController);
    app.put('/skyTrails/api/updateflightadvertisement',[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updateadvertisementController);
    app.get('/skyTrails/api/getflightadvertisementr',advertisementController.getflightadvertisementController);
    app.post('/skyTrails/api/createbustadvertisment',[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createbustadvertismentController);
    app.put('/skyTrails/api/updatebusadvertisement',[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updatebusadvertisementController);
    app.get('/skyTrails/api/getbusadvertisement',advertisementController.getbusadvertisementController);
    app.post('/skyTrails/api/createhoteladvertisment',[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createhoteladvertismentController);
    app.put('/skyTrails/api/updatehoteladvertisement',[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updatehoteladvertisementController);
    app.get('/skyTrails/api/gethoteladvertisement',advertisementController.gethoteladvertisementController);
    app.post('/skyTrails/api/user/getCancelUserHotelBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserHotelBookingSchema),userCancelController.cancelUserHotelBooking);
    app.post('/skyTrails/api/user/cancelUserFlightBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserFlightBookingSchema),userCancelController.cancelUserFlightBooking)
    app.post('/skyTrails/api/user/cancelUserBusBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserBusBookingSchema),userCancelController.cancelUserBusBooking)
    // app.get('/skyTrails/api/getCancelUserFlightBooking',advertisementController.getCancelUserFlightBooking);
    // app.get('/skyTrails/api/getCancelUserHotelBooking',advertisementController.getCancelUserHotelBooking);
    // app.get('/skyTrails/api/getCancelUserBusBooking',advertisementController.getCancelUserBusBooking);
    app.post('/skyTrails/api/user/createFlightCancelRequest',userCancelController.cancelUserFlightBooking);
    app.post('/skyTrails/api/user/createHotelCancelRequest',userCancelController.cancelUserHotelBooking);
    app.post('/skyTrails/api/user/createBusCancelRequest',userCancelController.cancelUserBusBooking);

}
