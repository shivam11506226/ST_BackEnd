const { responseFlags, responseMessages } = require("./const");

exports.mongoUrl = {
  DEVELOPMENT:
    "mongodb+srv://travvolt:asdf1234@travvoltcluster.ob9cb9w.mongodb.net/?retryWrites=true&w=majority",
};

exports.actionCompleteResponse = function (res, data, msg) {
  console.log(data);
  var response = {
    success: 1,
    message: msg || responseMessages.ACTION_COMPLETE,
    status: responseFlags.ACTION_COMPLETE,
    data: data || {},
  };
  res.status(responseFlags.ACTION_COMPLETE).send(JSON.stringify(response));
};

exports.sendActionFailedResponse = function (res, data, msg) {
  var response = {
    success: 0,
    message: msg || responseMessages.ACTION_FAILED,
    status: responseFlags.ACTION_FAILED,
    data: data || {},
  };

  return res.status(responseFlags.ACTION_FAILED).send(response);
};
