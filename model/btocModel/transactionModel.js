const mongoose = require("mongoose");
const status = require('../../enums/status');
const paymentStatus = require("../../enums/paymentStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');


const transactionSchema=new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    amount:{
        type:Number
    },
    paymentId:{
        type:String
    },
    status: {
        type: String,
        enum:[status.ACTIVE,status.BLOCK,status.DELETE],
        default: status.ACTIVE
    },
    paymentStatus:{
        type:String,
        enum:[paymentStatus.SUCCESS,paymentStatus.FAILED,paymentStatus.PENDING],
        default:paymentStatus.PENDING
    }
})