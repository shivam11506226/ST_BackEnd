const controller = require("../controllers/visa.controller");


module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
    app.post('/skyTrails/visa/createVisa',controller.createVisa);
    app.get('/skyTrails/visa/getAllVisa',controller.getAllVisa);

    //delete  by id
    app.delete("/skyTrails/deleteVisa/:id",controller.deleteVisa);

}