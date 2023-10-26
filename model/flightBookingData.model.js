const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const flightBookingData = mongoose.model(
  "flightBookingData",
  new mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: [true, "user ID is required"],
        ref: "User",
      },
      passengerDetails: {
        type: [
          {
            firstName: {
              type: String,
              required: [true, "first name is required"],
            },
            lastName: {
              type: String,
              required: [true, "last name is required"],
            },
            gender: {
              type: String,
              enum: ["male", "female", "transgender"],
              required: [true, "gender is required"],
            },
            phone: {
              country_code: {
                type: String,
                default: "+91",
                required: [true, "country_code is required"],
              },
              mobile_number: {
                type: Number,
                required: [true, "mobile_number is required"],
              },
            },
            dob: {
              type: String,
              required: [true, "dob is required"],
            },
            email: {
              type: String,
              required: [true, "email is required"],
              match: [/.+\@.+\..+/, "Please enter a valid email"],
            },
            address: {
              type: String,
              required: [true, "address is required"],
            },
            city: {
              type: String,
              required: [true, "city is required"],
            },
            country: {
              type: String,
              required: [true, "country is required"],
            },
          },
        ],
      },

      flightName: {
        type: String,
        required: [true, "flight name ountry is required"],
      },
      pnr: {
        type: Number,
        required: [true, "pnr is required"],
      },
      paymentStatus: {
        type: String,
        enum: ["success", "failure", "pending"],
        default: "pending",
      },
      transactionId: {
        type: String,
        required: [true, "transaction Id is required"],
      },
    },
    { timestamps: true }
  )
);

module.exports = flightBookingData;
