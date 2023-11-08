const busBookingController = require('../../controllers/btocController.js/busBookingController');
const flightBookingController=require('../../controllers/btocController.js/flightBookingController');
const hotelBookingController=require('../../controllers/btocController.js/hotelBookingController');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
    });
    // SchemaValidator(schemas.userbusBookingSchema),   SchemaValidator(schemas.userflightBookingSchema),  ,SchemaValidator(schemas.userhotelBookingSchema) 
    app.post('/skyTrails/api/user/busBooking', busBookingController.busBooking);
    app.post('/skyTrails/api/user/flighBooking',flightBookingController.flighBooking)
    app.post('/skyTrails/api/user/hotelBooking', hotelBookingController.hotelBooking);
    // app.put('/skyTrails/api/user/', controller.updatePost);
    // app.delete('/skyTrails/api/user/', controller.deletePost);
}
