const controller = require('../controllers/flightBookingData.controllers');
const schemas = require('../utilities/schema.utilities');
const SchemaValidator = require('../utilities/validations.utilities');


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    // app.post('/skyTrails/flightBooking/addFlightBookingData',SchemaValidator(schemas.flightBookingSchema),controller.addFlightBookingData);
    app.post('/skyTrails/flightBooking/addFlightBookingData',controller.addFlightBookingData);
    app.post('/skyTrails/flight/emailTicket',controller.EmailTicket);
    app.get('/skyTrails/flightBooking/getAllFlightsBooking',controller.getAllFlightsBooking);
    app.get('/skyTrails/flightBooking/getoneFlightsBooking/:id',controller.getoneFlightsBooking);
    app.delete('/skyTrails/flightBooking/deleteFlightBookings/:id',controller.deleteFlightBookings);
    app.delete('/skyTrails/flightBooking/deleteAllFlightBookings',controller.deleteAllFlightBookings);
    app.get('/skyTrails/flightBooking/getoneFlightsBookingById/:id',controller.getoneFlightsBookingById);
    // ================ Get All Flight Booking List for Admin ========

    app.post('/skyTrails/flightBooking/getAllFlightsBookingForAdmin', controller.getAllFlghtBookingForAdmin);
}