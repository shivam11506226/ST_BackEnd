const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require('../enums/status');
const approveStatus = require("../enums/approveStatus");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.pluralize(null);
const eventsSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    gallery:[{type: String}],
    status: {
        type: String,
        enum: [status.ACTIVE, status.BLOCK, status.DELETE],
        default:status.ACTIVE,
    },
   
},{timestamps:true})
eventsSchema.plugin(mongoosePaginate);

eventsSchema.plugin(aggregatePaginate);
const events = mongoose.model('skyTraislEvents', eventsSchema);

module.exports = events;