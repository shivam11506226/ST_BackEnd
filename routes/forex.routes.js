const controller = require("../controllers/forex.controllers");


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    app.post('/travvolt/forex/createForex',controller.createForex);
    app.get('/travvolt/forex/getAllForex',controller.getAllForex);
    app.delete('/travvolt/forex/deleteForex',controller.deleteForex);
    app.post('/travvolt/forex/createCustomerforex',controller.createCustomerforex);
    app.get('/travvolt/forex/getAllCustomerforex',controller.getAllCustomerforex);
    app.delete('/travvolt/forex/deleteCustomerforex',controller.deleteCustomerforex);
}