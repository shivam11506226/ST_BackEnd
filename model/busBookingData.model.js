const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const busBookingData = mongoose.model(
  "busBookingData",
  new mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'user ID is required'],
        ref: "User",
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
      },

      phone:
        { type: String, required: [true, 'phone is required'] },

      email: {
        type: String,
        required: [true, 'email is required'],
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
      },
      address: {
        type: String,
        required: [true, 'address is required'],
      },
      destination: {
        type: String,
        required: [true, 'destination is required'],
      },
      origin: {
        type: String,
        required: [true, 'origin is required'],
      },

      dateOfJourney: {
        type: String,
        required: [true, 'Date of Journey is required']
      },
      busType: {
        type: String,
        required: [true, 'Bus name is required'],
      },
      pnr: {
        type: String,
        required: [true, 'pnr is required']
      },
      busId: {
        type: Number,
        required: [true, 'bus Id is required']
      },
      noOfSeats: {
        type: Number, required: [true, '']
      }
    },
    { timestamps: true }
  )
);

module.exports = busBookingData;
