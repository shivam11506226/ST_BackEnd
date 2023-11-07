const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const BookingDetailSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        name: {
            type: String,
        },
        phone:
            { type: String, },

        email: {
            type: String,
        },
        address: {
            type: String,
        },
        destination: {
            type: String,
        },
        origin: {
            type: String,
        },
        dateOfJourney: {
            type: String,
        },
        busType: {
            type: String,
        },
        pnr: {
            type: String,
        },
        busId: {
            type: Number,
        },
        noOfSeats: {
            type: Number,
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
        transactions: {
            type: mongoose.Types.ObjectId,
            ref: 'transactions'
        },
        bookingType: {
            type: String,
            enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
            default: offerType.BUS
        }
    },
    { timestamps: true }
)
BookingDetailSchema.plugin(mongoosePaginate);

BookingDetailSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userbusBookingDetail", BookingDetailSchema);