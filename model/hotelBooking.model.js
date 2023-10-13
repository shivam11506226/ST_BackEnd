const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status=require('../enums/status');
const bookingStatus = require("../enums/bookingStatus");
mongoose.pluralize(null);

const hotelBookingDetail = mongoose.model(
  "hotelBookingDetail",
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
      BookingId: {
        type: String,
        // required: [true, 'booking id is required'],
      },

      CheckInDate: {
        type: Date,
        required: [true, 'Date of check in  required']
      },
      CheckOutDate: {
        type: Date,
        required: [true, 'Date of checkout  is required']
      },
      hotelName: {
        type: String,
        required: [true, 'hotel name is required'],
      },
      cityName: {
        type: String,
        required: [true, 'city name is required']
      },
      hotelId: {
        type: Number,
        required: [true, 'hotel Id is required']
      },
      noOfPeople: {
        type: Number, required: [true, '']
      },
      country: {
        type: String, required: [true, '']
      },
      room: {
        type: Number, required: [true, '']
      },
      night: {
        type: Number, required: [true, '']
      },
      status:{
        type:String,
        default:status.ACTIVE
      },
      bookingStatus:{
        type:String,
        default:bookingStatus.PENDING
      }
    },
    { timestamps: true }
  )
);

module.exports = hotelBookingDetail;
