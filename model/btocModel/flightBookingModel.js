const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../../enums/status');
const bookingStatus = require("../../enums/bookingStatus");
const gender=require("../../enums/gender");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
const offerType=require('../../enums/offerType')
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
            type: Number,
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
                title:{
                    type:String,
                },
                firstName: {
                    type: String,
                },
                lastName: {
                    type: String,
                },
                gender: {
                    type: String,
                    
                },
                ContactNo: {
                    type: String,
                },
                CountryCode:{
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
                PassportNo:{
                    type: String,
                }
            }
        ]
        ,
        status: {
            type: String,
            default: status.ACTIVE
        },
        bookingStatus: {
            type: String,
            enum:[bookingStatus.BOOKED,bookingStatus.CANCEL,bookingStatus.PENDING],
            default: bookingStatus.PENDING
        },
        transactions: {
            type: mongoose.Types.ObjectId,
            ref: 'userTransactions',
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