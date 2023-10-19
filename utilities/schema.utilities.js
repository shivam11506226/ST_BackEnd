const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const schemas = { 
  flightBookingSchema: joi.object().keys({ 
    
    userId:joi.objectId,
    firstName:joi.string().required(),
    lastName:joi.string().required(),
    gender:joi.string().max(5).required(),
    phone:{
        country_code:joi.string().max(4).required(),
        mobile_number:joi.string().max(10).required(),
    },
    dob:joi.string().required(),
    email:joi.string().email().required(),
    address:joi.string().required(),
    city:joi.string().required(),
    country:joi.string().required(),
    flightName:joi.string().required(),
    pnr:joi.number().required(),
    paymentStatus:joi.string().required(),
 }), 
  
 walletSchema:joi.object().keys({ 
        balance:joi.number().required(),
        userId:joi.objectId,
        currency:joi.string().max(3).required(),
  }), 
 
  addwalletAmountSchema: joi.object().keys({ 
    balance:joi.number().required(),
    currency:joi.string().max(3).required(),
    isAdmin:joi.objectId,
  }),
  payWalletAmount:joi.object().keys({
    amount:joi.number().required(),
  }),  

  //bus booking schema validation
  busBookingSchema: joi.object().keys({ 
    
    userId:joi.objectId,
    name:joi.string().required(),
    phone:joi.string().max(13).required(),
    email:joi.string().email().required(),
    address:joi.string().required(),
    destination:joi.string().required(),
    origin:joi.string().required(),
    dateOfJourney:joi.string().required(),
    busType:joi.string().required(),
    pnr:joi.string().required(),
    busId:joi.number().required(),
    noOfSeats:joi.number().required()
 }),

 //hotelBooking schema validation via JOI

 hotelBookingSchema:joi.object().keys({ 
    
  userId:joi.objectId,
  name:joi.string().required(),
  phone:joi.string().max(13).required(),
  email:joi.string().email().required(),
  address:joi.string().required(),
  destination:joi.string().required(),
  BookingId:joi.string().required(),
  CheckInDate:joi.string().required(),
  CheckOutDate:joi.string().required(),
  hotelName:joi.string().required(),
  hotelId:joi.string().required(),
  noOfPeople:joi.number().required(), 
  cityName:joi.string().required(),
  room:joi.number().required(),
  night:joi.number().required(),
  country:joi.string().required()
}),

//weeklyVisa schema validation via joi

weeklyVisaSchema:joi.object().keys({
  countryName:joi.string().required(),
  govermentFees:joi.number().required(),
  validityPeriod:joi.string().required(),
  lengthOfStay:joi.string().required(),
  gallery: joi.array().items(joi.string()).optional(),
  visaType:joi.string().required(),
  platFormFees:joi.number().required(),
}),

//static content validation via joi
staticContentSchema:joi.object().keys({
  title:joi.string().required(),
  description:joi.string().required(),
  type:joi.string().valid('FLIGHTS','HOTELS','BUSES','TRAINS','HOLIDAYPACKAGE','CABS','TRAVELINSURENCE','FORXCARD','PRODUCTOFFERING','ABOUTTHESITE','QUICKLINKS','IMPORTANTLINKS','CORPORATETRAVEL','TNC','PRIVACYPOLICY','ABOUTUS','RETURNPOLICY','BOOKINGPOLICY','QUESTION').required(),
  subType:joi.string().optional()
}),


faqSchema:joi.object().keys({
  type:joi.string().valid('FLIGHTS','HOTELS','BUSES','TRAINS','HOLIDAYPACKAGE','CABS','TRAVELINSURENCE','FORXCARD','PRODUCTOFFERING','ABOUTTHESITE','QUICKLINKS','IMPORTANTLINKS','CORPORATETRAVEL','TNC','PRIVACYPOLICY','ABOUTUS','RETURNPOLICY','BOOKINGPOLICY','QUESTION').required(),
  que:joi.string().required(),
  ans:joi.string().required(),
  staticContentTypeId:joi.string().optional()
})
}; 

module.exports = schemas;
