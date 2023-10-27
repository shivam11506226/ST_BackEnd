const mongoose = require('mongoose');
const status=require ('../../enums/status')
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null)
const visaSchema = new mongoose.Schema({
    countryName:{
        type:String
    },
    price:{
        type:Number
    },
    validityPeriod:{
        type:String
    },
    lengthOfStay:{
        type:String
    },
    gallery:[{
        type:String
    }],
    status:{
        type:String,
        default:status.ACTIVE
    },
    visaType:{
        type: String,
        // enum:[],
     },
     govermentFees:{
        type:Number
     },
     platFormFees:{
        type:Number
     },
    daysToProcess: {
        type: Number, 
    },
},{timestamps: true})
visaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("visa", visaSchema);