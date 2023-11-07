const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const status =require("../enums/status")
const flightBookingData = new mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: [true, "user ID is required"],
        ref: "userb2bs",
      },
      bookingId: {
        type:String,
        required: [true, "Booking id is required"],
      },
      pnr: {
        type: String,
        required: [true, "pnr is required"],
      },
      origin: {
        type: String,
        required : [true, "origin is required"],

      },
      destination : {
        type : String,
        required :[true, "destination is required"],
      },
      amount: {
        type : Number,
        required: [true, 'Amount is required'],
      },
      airlineDetails : {
        AirlineName:{
          type: String,
          required :[true, "airline name is required"],
        },
        DepTime : {
          type: String,
          required :[true, "Departure Time is required"],
        },
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
            ContactNo: {
                type: String,
                required: [true, "mobile_number is required"],
            },
            DateOfBirth: {
              type: String,
              required: [true, "dob is required"],
            },
            email: {
              type: String,
              required: [true, "email is required"],
              match: [/.+\@.+\..+/, "Please enter a valid email"],
            },
            addressLine1: {
              type: String,
              required: [true, "address is required"],
            },
            city: {
              type: String,
              required: [true, "city is required"],
            },
          },
        ],
      },
      paymentStatus: {
        type: String,
        enum: ["success", "failure", "pending"],
        default: "pending",
      },
      bookingType:{
        type: String,
        enum: ['busBookingData', 'flightbookingdatas', 'hotelBookingDetail']
      },
      status: {
        type: String,
        enums:[status.ACTIVES, status.BLOCK, status.ACTIVE],
        default: status.ACTIVE,
    },
    },
    { timestamps: true }
  )
  flightBookingData.plugin(mongoosePaginate);
  flightBookingData.plugin(aggregatePaginate)
  module.exports = mongoose.model("flightbookingdatas", flightBookingData);

