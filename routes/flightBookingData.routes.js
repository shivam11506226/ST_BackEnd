const controller = require('../controllers/flightBookingData.controllers');
const schemas = require('../utilities/schema.utilities');
const SchemaValidator = require('../utilities/validations.utilities');


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    app.post('/travvolt/flightBooking/addFlightBookingData',SchemaValidator(schemas.flightBookingSchema),controller.addFlightBookingData);
    app.get('/travvolt/flightBooking/getAllFlightsBooking',controller.getAllFlightsBooking);
    app.get('/travvolt/flightBooking/getoneFlightsBooking/:id',controller.getoneFlightsBooking);
    app.delete('/travvolt/flightBooking/deleteFlightBookings/:id',controller.deleteFlightBookings);
    app.delete('/travvolt/flightBooking/deleteAllFlightBookings',controller.deleteAllFlightBookings);

    // ================ Get All Flight Booking List for Admin ========

    app.post('/travvolt/flightBooking/getAllFlightsBookingForAdmin', controller.getAllFlghtBookingForAdmin);
}