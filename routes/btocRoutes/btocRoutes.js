// const {upload} = require('../../utilities/uploadHandler');
const busBookingController = require('../../controllers/btocController.js/busBookingController');
const flightBookingController=require('../../controllers/btocController.js/flightBookingController');
const hotelBookingController=require('../../controllers/btocController.js/hotelBookingController');
const advertisementController=require('../../controllers/btocController.js/advertisementController');
const userCancelController=require('../../controllers/btocController.js/cancelTicketController');
const packageController=require('../../controllers/btocController.js/packageBookingController');
const changeRequestController=require('../../controllers/btocController.js/changeRequestController')
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');
const upload=require('../../utilities/uploadHandler')
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

    app.get('/skyTrails/api/user/getUserBusBooking',[authJwt.verifcationToken],busBookingController.getBusBookingList);
    app.get('/skyTrails/api/user/getUserHotelBooking',[authJwt.verifcationToken],hotelBookingController.getAllHotelBookingList);
    // [authJwt.verifcationToken]
    app.get('/skyTrails/api/user/getUserHotelData',[authJwt.verifcationToken],hotelBookingController.getUserHotelData);
    app.get('/skyTrails/api/user/getUserBusData',[authJwt.verifcationToken],busBookingController.getUserBusData);
    app.post('/skyTrails/api/admin/createadvertisment',upload.handleFileUpload,SchemaValidator(schemas.advertisementSchema), advertisementController.createadvertismentController);
    app.put('/skyTrails/api/admin/updateadvertisement',upload.handleFileUpload,[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updateadvertisementController);
    app.get('/skyTrails/api/getadvertisement',advertisementController.getadvertisementController);
    app.post('/skyTrails/api/admin/createflightadvertisment',upload.handleFileUpload,[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createflightadvertismentController);
    app.put('/skyTrails/api/admin/updateflightadvertisement',upload.handleFileUpload,[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updateadvertisementController);
    app.get('/skyTrails/api/getflightadvertisement',advertisementController.getflightadvertisementController);
    app.post('/skyTrails/api/admin/createbustadvertisment',upload.handleFileUpload,[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createbustadvertismentController);
    app.put('/skyTrails/api/admin/updatebusadvertisement',upload.handleFileUpload,[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updatebusadvertisementController);
    app.get('/skyTrails/api/getbusadvertisement',advertisementController.getbusadvertisementController);
    app.post('/skyTrails/api/admin/createhoteladvertisment',upload.handleFileUpload,[authJwt.verifcationToken],SchemaValidator(schemas.advertisementSchema), advertisementController.createhoteladvertismentController);
    app.put('/skyTrails/api/admin/updatehoteladvertisement',upload.handleFileUpload,[authJwt.verifcationToken],SchemaValidator(schemas.updateadvertisementSchema), advertisementController.updatehoteladvertisementController);
    app.get('/skyTrails/api/gethoteladvertisement',advertisementController.gethoteladvertisementController);
    app.post('/skyTrails/api/user/cancelUserHotelBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserHotelBookingSchema),userCancelController.cancelUserHotelBooking);
    app.post('/skyTrails/api/user/cancelUserFlightBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserFlightBookingSchema),userCancelController.cancelUserFlightBooking)
    app.post('/skyTrails/api/user/cancelUserBusBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserBusBookingSchema),userCancelController.cancelUserBusBooking)
    app.get('/skyTrails/api/user/getCancelUserFlightBooking',[authJwt.verifcationToken],userCancelController.getCancelUserFlightBooking);
    app.get('/skyTrails/api/user/getCancelUserHotelBooking',[authJwt.verifcationToken],userCancelController.getCancelUserHotelBooking);
    app.get('/skyTrails/api/user/getCancelUserBusBooking',[authJwt.verifcationToken],userCancelController.getCancelUserBusBooking);
    app.post('/skyTrails/api/user/packageBooking',[authJwt.verifcationToken],SchemaValidator(schemas.packageBookingSchema),packageController.packageBooking);
    app.get('/skyTrails/api/user/getPackageBookigs',[authJwt.verifcationToken],packageController.getPackageBookigs);
    // app.post('/skyTrails/api/user/cancelUserHotelBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserHotelBookingSchema),changeRequestController.changeRequestController);
     app.post('/skyTrails/api/user/changeUserFlightBooking',[authJwt.verifcationToken],SchemaValidator(schemas.changeUserRequest),changeRequestController.createFlightTicketChangeRequest)
    // app.post('/skyTrails/api/user/cancelUserBusBooking',[authJwt.verifcationToken],SchemaValidator(schemas.cancelUserBusBookingSchema),changeRequestController.cancelUserBusBooking)
    app.get('/skyTrails/api/user/getChangelUserFlightBooking',[authJwt.verifcationToken],changeRequestController.getUserFlightChangeRequest);
    // app.get('/skyTrails/api/user/getCancelUserHotelBooking',changeRequestController.getCancelUserHotelBooking);
    // app.get('/skyTrails/api/user/getCancelUserBusBooking',changeRequestController.getCancelUserBusBooking);
}
