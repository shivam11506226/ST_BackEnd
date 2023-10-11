const controller = require('../controllers/busBookingData.controllers');
const schemas = require('../utilities/schema.utilities');
const SchemaValidator = require('../utilities/validations.utilities');


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    app.post('/travvolt/busBooking/addBusBookingData',SchemaValidator(schemas.busBookingSchema),controller.addBusBookingData);
    
}