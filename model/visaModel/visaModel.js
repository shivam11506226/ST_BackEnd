const mongoose = require('mongoose');
const status=require ('../../enums/status')
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
     }
},{timestamps: true})

module.exports = mongoose.model("weeklyVisa", visaSchema);