const controller = require("../controllers/visa.controller");


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    app.post('/travvolt/visa/createVisa',controller.createVisa);
    app.get('/travvolt/visa/getAllVisa',controller.getAllVisa);

}