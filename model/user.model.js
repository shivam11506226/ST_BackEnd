const mongoose = require("mongoose");
const userType = require('../enums/userType');
const { user } = require(".");
const status=require('../enums/status');
const approveStatus = require("../enums/approveStatus");
var bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = new mongoose.Schema(
    {
      username: { type: String },
      email: { type: String },
      password: { type: String },
      phone: {
        country_code: {
          type: String,
          default: "+91",
        },
        mobile_number: { type: String },
      },
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
      socialId: {
        type: String
      },
      socialType: {
        type: String
      },
      deviceType: {
        type: String
      },
      isOnline: {
        type: Boolean,
        default: false
      },
      firstTime: {
        type: Boolean,
        default: false
      },
      Address: {
        type: String
      },
      approveStatus:{
        type:String,
        enum:[approveStatus.APPROVED,approveStatus.PENDING,approveStatus.REJECT],
        default:approveStatus.PENDING
      },
      userType:{
        type:String,
        enum:[userType.ADMIN,userType.AGENT,userType.USER,userType.SUBADMIN],
        default:userType.USER
      },
      status:{
        type:String,
        enum:[status.ACTIVE,status.BLOCK,status.DELETE],
        default:status.ACTIVE
      },
      isApproved:{
        type: Boolean,
        default: false
      },
      reason: {
        type: String,
        default: "",
    },
    },
    {
      timestamps: true,
    }
  )
  userSchema.plugin(mongoosePaginate);

  const User = mongoose.model("users", userSchema);
  module.exports = User;


// Find admin user(s)
User.find({ userType: userType.ADMIN }, async (err, result) => {
  if (err) {
    console.log("DEFAULT ADMIN ERROR", err);
  } else if (result.length !== 0) {
    console.log("Default Admin(s) already exist.");
  } else {
    // Create a default admin user
    const obj = {
      userType: userType.ADMIN,
      username: "charu@123", // Use "username" instead of "userName" if that's your schema field
      email: "charuyadav594@theskytrails.com",
      phone: {
        country_code: "+91",
        mobile_number: "8115199076",
      },
      password: bcrypt.hashSync("theskytrails@1",10),
      Address: "New Delhi, India", // Use "Address" instead of "address" if that's your schema field
      isOnline: false,
      approveStatus: approveStatus.APPROVED, // Set approveStatus as needed
      status: status.ACTIVE, // Set status as needed
      isApproved: true,
    };

    // Create the default admin user
    User.create(obj, async (err1, result1) => {
      if (err1) {
        console.log("Default admin creation error", err1);
      } else {
        console.log("Default admin created", result1);
      }
    });
  }
});