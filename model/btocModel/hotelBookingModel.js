const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const hotelBookingDetailSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        phoneNumber:
        {
            country_code: {
                type: String,
                default: "+91",
            },
            mobile_number: {
                type: String
            }
        },
        email: {
            type: String,
        },
        address: {
            type: String,
        },
        bookingId: {
            type: String,
        },
        CheckInDate: {
            type: String,
        },
        hotelName: {
            type: String,
        },
        cityName: {
            type: String,
        },
        hotelId: {
            type: Number,
        },
        noOfPeople: {
            type: Number,
        },
        country: {
            type: String,
        },
        CheckOutDate: {
            type: String,
        },
        amount: {
            type: Number,
        },
        status: {
            type: String,
            default: status.ACTIVE
        },
        bookingStatus: {
            type: String,
            default: bookingStatus.PENDING
        },
        transactions:{
            type:mongoose.Types.ObjectId,
            ref:'transactions'
        },
        bookingType:{
            type:String,
            enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
            default:offerType.HOTELS
        }
    },
    { timestamps: true }
)
hotelBookingDetailSchema.plugin(mongoosePaginate);

hotelBookingDetailSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userHotelBookingDetail", hotelBookingDetailSchema);