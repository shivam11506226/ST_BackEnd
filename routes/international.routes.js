const controller = require("../controllers/international.controller");
// const controller = require("../controller/international.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
  app.post(
    "/travvolt/international/create",
    upload.single("file"),
    controller.internationalCreate
  );
  app.get("/travvolt/international/getone/:id", controller.internationalFind);
  app.put(
    "/travvolt/international/update/:id",
    upload.single("file"),
    controller.internationalupdate
  );
  app.delete(
    "/travvolt/international/deleteone/:id",
    controller.internationalDelete
  );
  app.get("/travvolt/international/getAll", controller.internationalgetAll);
  app.post(
    "/travvolt/international/setactive",
    controller.internationalSetActive
  );
  app.post(
    "/travvolt/international/pakageBookingrequest",
    controller.pakageBookingrequest
  );
  app.get(
    "/travvolt/international/getALLpakageBookingrequest",
    controller.getALLpakageBookingrequest
  );
  app.post("/travvolt/international/pakageBooking", controller.pakageBooking);
};
