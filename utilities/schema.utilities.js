const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
const schemas = {
  flightBookingSchema: joi.object().keys({
    userId: joi.string().required(),
    bookingId:joi.string().required(),
    pnr:joi.string().required(),
    origin:joi.string().required(),
    destination:joi.string().required(),
    amount:joi.number().required(),
    airlineDetails:joi.object({
      AirlineName:joi.string().required(),
      DepTime:joi.string().required()
    }),
    passengerDetails: joi.array().items(
      joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        gender: joi.string().required(),
        ContactNo:joi.string().required(),
        DateOfBirth: joi.string().required(),
        email: joi.string().email().required(),
        addressLine1: joi.string().required(),
        city: joi.string().required(),
      })
    ),
    // flightName: joi.string().required(),
    // pnr: joi.number().required(),
    paymentStatus: joi.string().required(),
    // transactionId: joi.string().required(),
  }),

  walletSchema: joi.object().keys({
    balance: joi.number().required(),
    userId: joi.objectId,
    currency: joi.string().max(3).required(),
  }),

  addwalletAmountSchema: joi.object().keys({
    balance: joi.number().required(),
    currency: joi.string().max(3).required(),
    isAdmin: joi.objectId,
  }),
  payWalletAmount: joi.object().keys({
    amount: joi.number().required(),
  }),

  //bus booking schema validation
  busBookingSchema: joi.object().keys({

    userId: joi.objectId,
    name: joi.string().required(),
    phone: joi.string().max(13).required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
    destination: joi.string().required(),
    origin: joi.string().required(),
    dateOfJourney: joi.string().required(),
    busType: joi.string().required(),
    pnr: joi.string().required(),
    busId: joi.number().required(),
    noOfSeats: joi.number().required()
  }),

  //hotelBooking schema validation via JOI

  hotelBookingSchema: joi.object().keys({

    userId: joi.objectId,
    name: joi.string().required(),
    phone: joi.string().max(13).required(),
    email: joi.string().email().required(),
    address: joi.string().required(),
    destination: joi.string().required(),
    BookingId: joi.string().required(),
    CheckInDate: joi.string().required(),
    CheckOutDate: joi.string().required(),
    hotelName: joi.string().required(),
    hotelId: joi.string().required(),
    noOfPeople: joi.number().required(),
    cityName: joi.string().required(),
    room: joi.number().required(),
    night: joi.number().required(),
    country: joi.string().required()
  }),

  //weeklyVisa schema validation via joi

  weeklyVisaSchema: joi.object().keys({
    countryName: joi.string().required(),
    govermentFees: joi.number().required(),
    validityPeriod: joi.string().required(),
    lengthOfStay: joi.string().required(),
    gallery: joi.array().items(joi.string()).optional(),
    visaType: joi.string().required(),
    platFormFees: joi.number().required(),
  }),

  //static content validation via joi
  staticContentSchema: joi.object().keys({
    title: joi.string().required(),
    description: joi.string().required(),
    type: joi.string().valid('FLIGHTS', 'HOTELS', 'BUSES', 'TRAINS', 'HOLIDAYPACKAGE', 'CABS', 'TRAVELINSURENCE', 'FORXCARD', 'PRODUCTOFFERING', 'ABOUTTHESITE', 'QUICKLINKS', 'IMPORTANTLINKS', 'CORPORATETRAVEL', 'TNC', 'PRIVACYPOLICY', 'ABOUTUS', 'RETURNPOLICY', 'BOOKINGPOLICY', 'QUESTION').required(),
    subType: joi.string().optional()
  }),


  faqSchema: joi.object().keys({
    type: joi.string().valid('FLIGHTS', 'HOTELS', 'BUSES', 'TRAINS', 'HOLIDAYPACKAGE', 'CABS', 'TRAVELINSURENCE', 'FORXCARD', 'PRODUCTOFFERING', 'ABOUTTHESITE', 'QUICKLINKS', 'IMPORTANTLINKS', 'CORPORATETRAVEL', 'TNC', 'PRIVACYPOLICY', 'ABOUTUS', 'RETURNPOLICY', 'BOOKINGPOLICY', 'QUESTION').required(),
    que: joi.string().required(),
    ans: joi.string().required(),
    staticContentTypeId: joi.string().optional()
  }),

  //forumSchema*******************************
  forumQueSchema: joi.object().keys({
    content: joi.string().required(),
    userId: joi.string().required(),
    
  }),
  //getData*********************************
  forumgetSchemas: joi.object().keys({
    search: joi.string().optional(),
    page: joi.number().optional(),
    limit: joi.number().optional(),
    questionId: joi.string().optional(),
    userId: joi.string().optional(),
  }),

  forumQueAnsComm:joi.object().keys({
    questionId:joi.string().required(),
    content: joi.string().required(),
    userId: joi.string().required(),
    commentId: joi.string().optional(),

  }),

  forumQueAnsgetSchemas: joi.object().keys({
    search: joi.string().optional(),
    page: joi.number().optional(),
    limit: joi.number().optional(),
    questionId: joi.string().optional(),
    answerId: joi.string().optional(),
    userId: joi.string().optional(),
  }),

  socialLoginSchema:joi.object().keys({
    socialId: joi.string().required(),
    socialType: joi.string().required(),
    deviceType: joi.string().required(),
    username: joi.string().optional(),
    email: joi.string().optional(),
    mobileNumber: joi.string().optional(),
    password:joi.string().optional(),
    userId:joi.string().optional()
  }),

  subAdminSchema:joi.object().keys({
    username: joi.string().required(),
    email: joi.string().required(),
    mobile_number: joi.string().required(),
    password:joi.string().required(),
  }),
  updateSubAdmin:joi.object().keys({
    subAdminId:joi.string().required(),
    username: joi.string().optional(),
    email: joi.string().optional(),
    mobile_number: joi.string().optional(),
  }),
  adminLoginSchema:joi.object().keys({
    email: joi.string().optional(),
    mobileNumber: joi.string().optional(),
    password: joi.string().required(),
  }),
  subAdminLogin:joi.object().keys({
    email: joi.string().optional(),
    mobileNumber: joi.string().optional(),
    password: joi.string().required(),
  }),

  userLoginSchema:joi.object().keys({
    email: joi.string().required(),
    password: joi.string().required(),
  }),

  userSignupSchema:joi.object().keys({
    email: joi.string().required(),
    mobileNumber: joi.string().required(),
    password: joi.string().required(),
    username: joi.string().required(),
    Address:joi.string().required(),
    profilePic:joi.string().optional(),
    userType:joi.string().optional(),
  }),
  
  userVerifySchema:joi.object().keys({
    otp: joi.string().required(),
    email: joi.string().optional(),
    password: joi.string().optional(),
    username: joi.string().optional(),
    Address:joi.string().optional(),
    profilePic:joi.string().optional(),
  }),

  userForgetSchema:joi.object().keys({
    email: joi.string().required(),
  }),

  approveAgentSchema:joi.object().keys({
    userId:joi.string().required(), 
    approveStatus:joi.string().required(),
    reason:joi.string().optional()
  }),
  btoCuserLoginSchema:joi.object().keys({
    mobileNumber:joi.string().required()
  })

};

module.exports = schemas;
