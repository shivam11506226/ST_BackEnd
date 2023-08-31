const axios = require('axios');
const { tokenGenerator, api } = require("../common/const");
const {
    actionCompleteResponse,
    sendActionFailedResponse,
  } = require("../common/common");





  exports.userLogin = async (req, res) => {
    const { UserName, Passwd,SponsorFormNo } = req.body;
  
    const data = {
      UserName,
      Passwd,
      SponsorFormNo,
    };
  
    try {
      const response = await axios.post(`${api.utilityloginwebapiURL}`, data, {
        headers: {
          'Content-Type': 'application/json',
          token: 'QVBJQWNjZXNzQVBJQDEyMw==' // Replace with your actual token
        }
      });
  
      msg = "Transaction Success!";

      actionCompleteResponse(res, response.data, msg);
    } catch (err) {
      console.log(err);
      sendActionFailedResponse(res, {}, err.message);
    }
  };
