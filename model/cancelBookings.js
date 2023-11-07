const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../enums/status');
const bookingStatus = require("../enums/bookingStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const cancelBookingDataSchema =
    new mongoose.Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users"
        },
        reason: {
            type: String
        },
        booking: {
            type: Schema.Types.ObjectId,
            refPath: "bookingType"
        },
        bookingType: {
            type: String,
            enum: ['busBookingData', 'flightbookingdatas', 'hotelBookingDetail']
        },
        status: {
            type: String,
            default: "ACTIVE"
        },
        bookingStatus: {
            type: String,
            enums: [bookingStatus.BOOKED, busBookingData.CANCEL, bookingStatus.PENDING],
        },
    }, { timestamps: true }
    )
cancelBookingDataSchema.plugin(mongoosePaginate);

cancelBookingDataSchema.plugin(aggregatePaginate);

const cancelBookingData = mongoose.model("busBookingData", cancelBookingDataSchema);
module.exports = cancelBookingData;
