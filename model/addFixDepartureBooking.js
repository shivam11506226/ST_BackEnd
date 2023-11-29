const mongoose=require('mongoose');
const { Schema } = require("mongoose");

const FixDepartureBookingModal=new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "userb2bs",
    },
    loginName :{
        type: String,
    },
    numberOfSeats :{
        type: Number,
    },
    phoneNo :{
        type : Number,
    },
    soldTo :{
        type :String,
    },
    status: {
        type :String,
    },
    emailId : {
        type :String,
    },
    finalSalePrice :{
        type :Number,
    },
    names: {
        type: [
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
            passport: {
                type: String,
              },
              passportExpire: {
                type: String,
              },
          },
        ],
      },
       
},
{
    timestamps: true,
  }
)


module.exports=mongoose.model('fixdeparturebookings', FixDepartureBookingModal);