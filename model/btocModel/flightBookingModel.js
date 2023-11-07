const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const gender=require("../../enums/gender");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const BookingDetailSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        amount: {
            type: Number,
        },
        bookingId: {
            type: String,
        },
        pnr: {
            type: String,
        },
        origin: {
            type: String,
        },
        destination: {
            type: String,
        },
        amount: {
            type: Number,
        },
        airlineDetails: {
            AirlineName: {
                type: String,
            },
            DepTime: {
                type: String,
            },
        },
        passengerDetails: [
            {
                firstName: {
                    type: String,
                },
                lastName: {
                    type: String,
                },
                gender: {
                    type: String,
                    enum: [gender.FEMALE, gender.MALE, gender.OTHER],
                },
                ContactNo: {
                    type: String,
                },
                DateOfBirth: {
                    type: String,
                },
                email: {
                    type: String,
                },
                addressLine1: {
                    type: String,
                },
                city: {
                    type: String,
                },
            }
        ]
        ,
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
            default: offerType.FLIGHTS
        }
    },
    { timestamps: true }
)
BookingDetailSchema.plugin(mongoosePaginate);

BookingDetailSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("userflightBookingDetail", BookingDetailSchema);