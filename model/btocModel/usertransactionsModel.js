const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const offerType = require("../../enums/offerType");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new Transaction({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    amount: { type: Number },
    flightBookingId: {
        type: Schema.Types.ObjectId,
        ref: "userflightBookingDetail"
    },
    busBookingId: {
        type: Schema.Types.ObjectId,
        ref: "userbusBookingDetail"
    },
    hotelBookingId: {
        type: Schema.Types.ObjectId,
        ref: "userHotelBookingDetail"
    },
    bookingType: {
        type: String,
        enum: [offerType.FLIGHTS, offerType.HOTELS, offerType.BUS],
    },
    transactionStatus: {
        type: String,
        enum: [bookingStatus.PENDING, bookingStatus.SUCCESS, bookingStatus.FAILED],
        default: bookingStatus.PENDING
    }

}, { timeStamp: true })

transactionSchema.plugin(aggregatePaginate);

transactionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("transactions", transactionSchema);