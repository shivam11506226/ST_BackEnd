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

      oneWay:{
        type:Boolean,
        required: [true, "journey type is required"]

      },
      bookingId: {
        type:String,
        required: [true, "Booking id is required"],
      },
      pnr: {
        type: String,
        required: [true, "pnr is required"],
      },
      dateOfJourney :{
        type: String,
        required :[true, "Date of journey is required"]
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
              required: true,
            },
            lastName: {
              type: String,
              required: true,
            },
            gender: {
              type: String,
            },
            ContactNo: {
              type: String,
            },
            DateOfBirth: {
              type: String,
              required: true,
            },
            email: {
              type: String,
              validate: {
                validator: (v) => /.+\@.+\..+/.test(v),
                message: 'Please enter a valid email',
              },
            },
            addressLine1: {
              type: String,
            },
            city: {
              type: String,
            },
          },
        ],
      },
      paymentStatus: {
        type: String,
        enum: ["success", "failure", "pending"],
        default: "pending",
      },
      // bookingType:{
      //   type: String,
      //   enum: ['busBookingData', 'flightbookingdatas', 'hotelBookingDetail']
      // },
    //   status: {
    //     type: String,
    //     enums:[status.ACTIVES, status.BLOCK, status.ACTIVE],
    //     default: status.ACTIVE,
    // },
    },
    { timestamps: true }
  )
  flightBookingData.plugin(mongoosePaginate);
  flightBookingData.plugin(aggregatePaginate)
  module.exports = mongoose.model("flightbookingdatas", flightBookingData);

