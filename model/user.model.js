const mongoose = require("mongoose");
const userType = require('../enums/userType')
const User = mongoose.model(
  "User",
  new mongoose.Schema(
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
    },
    {
      timestamps: true,
    }
  )
);

module.exports = User;
