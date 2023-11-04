const Joi = require("joi");
const { offerSchemaValidation } = require("../../model/offers/offer.model");
const { Offer } = require("../../model/offers/offer.model");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../../common/common");
// const status = require("../../enums/status");
const offerType = require("../../enums/offerType");

exports.createOffer = async (req, res) => {
  const { title, discount, promocode, offerdetails, status, offertype } =
    req.body;
  var media;

  media = req.files.map(async (singleFile) => {
    const finalLocation = `/${singleFile.Key}`;
    return {
      mediaType: "photo",
      link: finalLocation,
    };
  });
  media = await Promise.all(media);

  // Example data to validate
  const dataToValidate = {
    title: title,
    media: media,
    discount: {
      amount: discount,
      type: "percentage",
    },
    use_code: promocode,
    offerdetails: offerdetails,
    status: status,
    offertype: offertype,
  };

  try {
    // Validate the data using Joi
    const { error, value } = offerSchemaValidation.validate(dataToValidate);

    if (error) {
      sendActionFailedResponse(res, {}, error.details);
      console.error("Validation error:", error.details);
    } else {
      // Data is valid, you can proceed to save it to the database
      const newOffer = new Offer(value);
      newOffer
        .save()
        .then((savedOffer) => {
          const msg = "Offer saved successfully.";
          actionCompleteResponse(res, savedOffer, msg);
          console.log("Offer saved:", savedOffer);
        })
        .catch((err) => {
          sendActionFailedResponse(res, {}, err.message);
          console.error("Error saving offer:", err);
        });
    }
  } catch (validationError) {
    // Handle any errors that occur during validation
    sendActionFailedResponse(res, {}, validationError.message);
    console.error("Validation error:", validationError);
  }
};

exports.getOffer = async (req, res) => {
  try {
    const { offertype } = req.body;
    let response;

    if (offertype === offerType.BANKOFFERS) {
      response = await Offer.find({
        offertype: offerType.BANKOFFERS,
      });
    } else if (offertype === offerType.CABS) {
      response = await Offer.find({
        offertype: offerType.CABS,
      });
    } else if (offertype === offerType.FLIGHTS) {
      response = await Offer.find({
        offertype: offerType.FLIGHTS,
      });
    } else if (offertype === offerType.HOLIDAYS) {
      response = await Offer.find({
        offertype: offerType.HOLIDAYS,
      });
    } else if (offertype === offerType.HOTELS) {
      response = await Offer.find({
        offertype: offerType.HOTELS,
      });
    } else if (offertype === offerType.TRAINS) {
      response = await Offer.find({
        offertype: offerType.TRAINS,
      });
    } else {
      response = await Offer.find({});
    }

    const msg = "Offer get data successfully.";
    actionCompleteResponse(res, response, msg); // Use 'response' instead of 'result'
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message); // Use 'error' instead of 'err'
  }
};


exports.updateOffer = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      const msg = "id is required";
      sendActionFailedResponse(res, {}, msg);
    }
    const isDataExist = await offers.findOne({
      _id: id,
    });
    if (!isDataExist) {
      const msg = "Data not found";
      sendActionFailedResponse(res, {}, msg);
    }
    const result = await offers.updateOne({ _id: isDataExist._id }, req.body);
    const msg = "Offer updated successfully.";
    actionCompleteResponse(res, result, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.deleteOffer = async (req, res) => {
  const OfferDataId = req.body.id;
  try {
    if (!OfferDataId) {
      const msg = "OfferDataId is required";
      sendActionFailedResponse(res, {}, msg);
    }
    const isDataExist = await offers.findOne({
      _id: OfferDataId,
    });
    if (!isDataExist) {
      const msg = "Data not found";
      sendActionFailedResponse(res, {}, msg);
    }
    const result = await offers.deleteOne({ _id: isDataExist._id });
    const msg = "Offer delete successfully.";
    actionCompleteResponse(res, result, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};
