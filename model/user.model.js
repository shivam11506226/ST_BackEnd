const mongoose = require("mongoose");

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
    },
    {
      timestamps: true,
    }
  )
);

module.exports = User;
