const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../enums/status');
const bookingStatus = require("../enums/bookingStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const busBookingDataSchema =
  new mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
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
        required: [true, 'pnr is required'],
      },
      busId: {
        type: Number,
        required: [true, 'bus Id is required'],
      },
      noOfSeats: {
        type: Number, required: [true, 'no of seats is required'],
      },
      amount:{
        type:Number,
        required:[true, 'amount is required'],

      },
      status: {
        type: String,
        default: status.ACTIVE
      },
      bookingStatus: {
        type: String,
        default: bookingStatus.PENDING
      }
    },
    { timestamps: true }
  )
busBookingDataSchema.plugin(mongoosePaginate);

busBookingDataSchema.plugin(aggregatePaginate);

const busBookingData = mongoose.model("busBookingData", busBookingDataSchema);
module.exports = busBookingData;
