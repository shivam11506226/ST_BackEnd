const controller = require("../controllers/b2bauth.controller");
const multer = require("multer");

// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post( "/travvolt/b2b/register",upload.single("file"), controller.RegisterUser);
  app.post("/travvolt/b2b/login", controller.LoginUser);
  app.post("/travvolt/user/update", controller.UserUpdate);
  app.delete("/travvolt/user/delete", controller.deleteUser);
  app.get("/travvolt/user/getallusers", controller.Getallusers);
  app.post("/travvolt/user/setmarkup", controller.SetMarkup);
  app.get("/travvolt/user/getmarkup/:userId", controller.GetMarkup);
  

  //get singleuserbyid
  app.get("/travvolt/user/:userId",controller.UserById);

//update balance route
  app.post("/updateBalance", controller.updateUserBalance);
  //veryfiyrazorPay

  app.post('/payVerify',controller.payVerify);


};
