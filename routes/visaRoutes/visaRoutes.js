const controller=require('../../controllers/visaController/visaController');
const auth=require ('../../middleware/authJwt');
const schemas = require('../../utilities/schema.utilities');
const SchemaValidator = require('../../utilities/validations.utilities');

module.exports=function(app){
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
        next();
      });
      app.post('/skyTrails/weeklyVisa/createWeeklyVisa', SchemaValidator(schemas.weeklyVisaSchema),controller.createWeeklyVisa)

      app.get('/skyTrails/weeklyVisa/getWeeklyVisa',controller.getWeeklyVisa)
      app.put('/skyTrails/weeklyVisa/updateWeeklyVisa',controller.updateWeeklyVisa)
      app.delete('/skyTrails/weeklyVisa/deleteWeeklyVisa',controller.deleteWeeklyVisa);
    }