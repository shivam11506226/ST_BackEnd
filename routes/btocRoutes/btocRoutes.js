const busBookingController = require('../../controllers/btocController.js/busBookingController');
const flightBookingController=require('../../controllers/btocController.js/flightBookingController');
const hotelBookingController=require('../../controllers/btocController.js/hotelBookingController');
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
    app.post('/skyTrails/api/user/flighBooking',[authJwt.verifcationToken],flightBookingController.flighBooking)
    app.post('/skyTrails/api/user/hotelBooking',[authJwt.verifcationToken], hotelBookingController.hotelBooking);
    // app.put('/skyTrails/api/user/', controller.updatePost);
    // app.delete('/skyTrails/api/user/', controller.deletePost);
    app.get('/skytrails/api/user/getUserflightBooking',[authJwt.verifcationToken],flightBookingController.getUserflightBooking);
    app.get('/skyTrails/api/user/getUserFlightData',[authJwt.verifcationToken],flightBookingController.getUserFlightData)
}
