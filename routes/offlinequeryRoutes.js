const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const SchemaValidator = require("../utilities/validations.utilities");
const schemas = require('../utilities/schema.utilities');
constofflinequeryController=require("../controllers/offlineQueryController") 
module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
      next();
    });
  
    app.post("/skytrails/api/query/createofflineQuery", SchemaValidator(schemas.offlineQuerySchema),constofflinequeryController.createofflineQuery)
  
  
  
  
  
  }