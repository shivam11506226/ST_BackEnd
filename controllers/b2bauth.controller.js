const db = require("../model");
const b2bUser = db.userb2b;
var bcrypt = require("bcryptjs");
const wallet = require('../model/wallet.model');
const User = require('../model/user.model');
const Role = require('../model/role.model');

const aws = require("aws-sdk");
const {
  actionCompleteResponse,
  sendActionFailedResponse,
} = require("../common/common");

console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

// Set up AWS S3 client
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.RegisterUser = async (req, res) => {
  // Upload image to S3
  const reqData = JSON.parse(req.body.data);
  const file = req?.file;
  var salt = bcrypt.genSaltSync(10);
  console.log(reqData.personal_details.password);
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  s3.upload(s3Params, async (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // Save user to database
      const user = new b2bUser({
        personal_details: {
          ...reqData.personal_details,
          mobile: {
            country_code: "+91",
            mobile_number: reqData.personal_details.mobile.mobile_number,
          },
          password: bcrypt.hashSync(reqData.personal_details.password,salt),
        },
        agency_details: {
          ...reqData.agency_details,
          agency_mobile: {
            country_code: "+91",
            mobile_number: reqData.agency_details.agency_mobile.mobile_number,
          },
          document_details: {
            pan_card_document: data.Location,
          },
        },
        agency_gst_details: {
          ...reqData.agency_gst_details,
        },
      });

      try {
        var size = Object.keys(user).length;
        if(size > 0) {
          const walletdata = await wallet.create({userId:user._id.toString(),currency:reqData.currency,status:"successful"});
          user.walletid = walletdata._id.toString();
          // console.log(walletdata._id.toString());
        }
        const response = await user.save();
        msg = "Data Saved Successfully";
        actionCompleteResponse(res,response, msg);
      } catch (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
      }
    }
  });
};

exports.LoginUser = async (req, res) => {
  b2bUser
    .findOne({ "personal_details.email": req.body.email })
    .exec((err, user) => {
      if (err) {
        console.log(err);
        sendActionFailedResponse(res, {}, err.message);
      }

      if (!user) {
        const msg = "User Not found.";
        sendActionFailedResponse(res, {}, msg);
      }

      if (user?.is_active == 0) {
        const msg = "User Disabled Please Contact your Administrator";
        sendActionFailedResponse(res, {}, msg);
      } else if (user?.is_active == 1) {
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user?.personal_details?.password
        );

        if (!passwordIsValid) {
          // return res.status(401).send({ message: "Invalid Password!" });
          const msg = "Invalid Password!";
          sendActionFailedResponse(res, {}, msg);
        }
        const response = {
          id: user._id,
          username: user?.personal_details?.first_name,
          email: user?.personal_details?.email,
          balance: user?.balance,
          markup: user?.markup
        };
        msg = "User Login Successfully!";
        actionCompleteResponse(res, response, msg);
      }
    });
};

exports.UserUpdate = async (req, res) => {
  try {
    let { user_id, is_active } = req.body;
    let findCri = {
      _id: user_id,
    };
    let updateCri = {
      is_active: is_active,
    };

    await b2bUser.findOneAndUpdate(findCri, updateCri, { new: true });
    msg = "Status has been updated successfully";
    let resData = {
      updateCri,
    };
    actionCompleteResponse(res, resData, msg);
  } catch (error) {
    console.log(err);
    sendActionFailedResponse(res, {}, err.message);
  }
};

exports.deleteUser = async (req,res)=>{
  const userId = req.body.userId;
  try {
    const user = await User.findById(req.body.isAdmin);
    const role = await Role.findById(user.roles[0].toString());
   if(role.name === 'admin'){
      const response = await b2bUser.findByIdAndDelete(userId);
      // console.log(response.walletid.toString());
       await wallet.findByIdAndDelete(response.walletid.toString());
      const msg = "user deleted successfully"
      actionCompleteResponse(res, {}, msg);
   }
  else{
    const msg = "only Admin can delete b2b users "
    actionCompleteResponse(res, {}, msg);
  }
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
}

exports.Getallusers = async (req, res) => {
  try {
   const users = await b2bUser.find();
    msg = "User Fetched";
    actionCompleteResponse(res, users, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
  }
};

exports.SetMarkup = async (req, res) => {
  try {
    const { userId } = req.body; //destructure userId and amount from request body
    //check if userId is valid in table
    const resData = await b2bUser.findById(userId); 
    console.log(resData);
    const user = await b2bUser.findOneAndUpdate(
      { _id: userId },
      { $set: { markup:{
         bus: req.body.markup.bus ||resData.markup.bus,
         hotel:req.body.markup.hotel ||resData.markup.hotel,
         flight:req.body.markup.flight ||resData.markup.flight,
         holiday:req.body.markup.holiday ||resData.markup.holiday
      }} },
      { new: true }
    );
    if (!user) {
      msg = "Invalid userId";
      sendActionFailedResponse(res, {}, msg);
    }
    msg = "Amount updated successfully";
    actionCompleteResponse(res, user, msg);
  } catch (error) {
    sendActionFailedResponse(res, {}, error.message);
    console.log(error);
  }
};

exports.GetMarkup = async (req, res) => {
  try {
    const { userId } = req.params; //destructure userId from request params
    const user = await b2bUser.findOne({ _id: userId },"markup");
    if (!user) {
      sendActionFailedResponse(res, {}, "Invalid userId");
    } else {
      actionCompleteResponse(res, user, "Markup amount retrieved successfully");
    }
  } catch (error) {
    sendActionFailedResponse(res, {}, "Internal server error");
    console.log(error);
  }
};



