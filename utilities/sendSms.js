const twilio = require("twilio");
const axios = require("axios");
const querystring = require('querystring');
const TWILIO_ACCOUNT_SID = "AC1d054c048e824d5901cb75de99db3938";
const TWILIO_AUTH_TOKEN = "0522a6beb1d8f3418a72988eae4e0196";
const YOUR_TWILIO_PHONE_NUMBER = "+12248882704";

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const key = "lbwUbocDLNFjenpa"; // Or use multiple numbers like: "XXXXXXXXXX,XXXXXXXXXX"
const senderid = "SKTRAL";
const route = 1;
const templateid = "1007338024565017323";
const templateid1="1007929145692124903";
const templateid2="1007809387575121367";
const templateid3="1007413294765585646";
const subAdmintemplateid="1007236255884587845"
const baseURL = 'https://localhost:8000';

// module.exports = {
//   sendSMSForFlightBookingConfirmation: async (data) => {
//     const recipientPhoneNumber = `${data.passengerDetails[0].phone.country_code} ${data.passengerDetails[0].phone.mobile_number}`; // The passenger's phone number
//     const message =
//       `Hello ${data.passengerDetails[0].firstName} ${data.passengerDetails[0].lastName},\n\n` +
//       `Thank you for booking your flight with The Skytrails. Your booking is confirmed! Here are the details:\n\n` +
//       `PNR NO: [Flight Number]\n` +
//       `Departure Date & Time: [Departure Date and Time]\n` +
//       `Departure Airport: [Departure Airport Code]\n` +
//       `Arrival Airport: [Arrival Airport Code]\n` +
//       `Booking Reference: [Booking Reference]\n` +
//       `Seat(s): [Seat Number(s)]\n\n` +
//       `Please arrive at the airport at least [Arrival Time] before the flight.\n\n` +
//       `For any inquiries or changes to your booking, please contact [Airline Contact Information].\n\n` +
//       `Have a great flight with [Airline Name]!\n\n` +
//       `Safe travels!`;

//     client.messages
//       .create({
//         body: message,
//         from: YOUR_TWILIO_PHONE_NUMBER,
//         to: "+919973884727 ",
//       })
//       .then((message) => console.log(`Message sent with SID: ${message.sid}`))
//       .catch((error) => console.error(error));
//   },
//   sendSMSForHotelBookingConfirmation: async (data) => {
//     const recipientPhoneNumber = `${data.phone.country_code} ${data.phone.mobile_number}`; // The passenger's phone number
//     const message =
//       `Hello ${data.firstName} ${data.lastName},\n\n` +
//       `Thank you for booking your hotel stay with The Skytrails. Your reservation is confirmed! Here are the details:\n\n` +
//       `Booking Reference: ${data.bookingReference}\n` +
//       `Check-in Date: ${data.checkInDate}\n` +
//       `Check-out Date: ${data.checkOutDate}\n` +
//       `Hotel Name: ${data.hotelName}\n` +
//       `Room Type: ${data.roomType}\n` +
//       `Number of Guests: ${data.numberOfGuests}\n` +
//       `Total Price: ${data.totalPrice} USD\n\n` +
//       `If you have any questions or need to make changes to your reservation, please contact our customer support at [Customer Support Phone Number].\n\n` +
//       `We hope you enjoy your stay at ${data.hotelName}!\n\n` +
//       `Safe travels!`;

//     client.messages
//       .create({
//         body: message,
//         from: YOUR_TWILIO_PHONE_NUMBER,
//         to: "+919973884727 ",
//       })
//       .then((message) => console.log(`Message sent with SID: ${message.sid}`))
//       .catch((error) => console.error(error));
//   },
//   sendSMSForBusBookingConfirmation: async (data) => {
//     const recipientPhoneNumber = `${data.phone.country_code} ${data.phone.mobile_number}`; // The passenger's phone number
//     const message =
//       `Hello ${data.firstName} ${data. lastName},\n\n` +
//       `Thank you for booking your bus ticket with The Sky Bus Company. Your booking is confirmed! Here are the details:\n\n` +
//       `Booking Reference: ${data.bookingReference}\n` +
//       `Departure Date & Time: ${data.departureDateTime}\n` +
//       `Departure Location: ${data.departureLocation}\n` +
//       `Arrival Location: ${data.arrivalLocation}\n` +
//       `Seat Number: ${data.seatNumber}\n\n` +
//       `Please arrive at the departure location at least 30 minutes before departure.\n\n` +
//       `For any inquiries or changes to your booking, please contact our customer support at [Customer Support Phone Number].\n\n` +
//       `We wish you a pleasant journey with The Sky Bus Company!\n\n` +
//       `Safe travels!`;

//     client.messages
//       .create({
//         body: message,
//         from: YOUR_TWILIO_PHONE_NUMBER,
//         to: "+919973884727",
//       })
//       .then((message) => console.log(`Message sent with SID: ${message.sid}`))
//       .catch((error) => console.error(error));
//   },
//   sendSMSForOtp: async (mobileNumber,otp) => {
//     try {
//       // const recipientPhoneNumber = `${data.phone.country_code} ${data.phone.mobile_number}`;
//       const messageData = `This is your OTP ${otp}, for verifying your mobile number ${mobileNumber}. Please verify the OTP. OTP expires in 3 minutes.`;

//       const message = await client.messages.create({
//         body: messageData,
//         from: YOUR_TWILIO_PHONE_NUMBER,
//         to: "+919973884727",
//       });
//       console.log("======================",message);
//       console.log(`Message sent with SID: ${message.sid}`);
//       return { success: true, message: 'OTP sent successfully!' };
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       return { success: false, message: 'Failed to send OTP' };
//     }
//   }

// };
module.exports = {
  sendSMSForFlightBookingConfirmation: async (data) => {
    const recipientPhoneNumber = `${data.passengerDetails[0].phone.country_code} ${data.passengerDetails[0].phone.mobile_number}`; // The passenger's phone number
    const message =
      `Hello ${data.passengerDetails[0].firstName} ${data.passengerDetails[0].lastName},\n\n` +
      `Thank you for booking your flight with The Skytrails. Your booking is confirmed! Here are the details:\n\n` +
      `PNR NO: [Flight Number]\n` +
      `Departure Date & Time: [Departure Date and Time]\n` +
      `Departure Airport: [Departure Airport Code]\n` +
      `Arrival Airport: [Arrival Airport Code]\n` +
      `Booking Reference: [Booking Reference]\n` +
      `Seat(s): [Seat Number(s)]\n\n` +
      `Please arrive at the airport at least [Arrival Time] before the flight.\n\n` +
      `For any inquiries or changes to your booking, please contact [Airline Contact Information].\n\n` +
      `Have a great flight with [Airline Name]!\n\n` +
      `Safe travels!`;

    client.messages
      .create({
        body: message,
        from: YOUR_TWILIO_PHONE_NUMBER,
        to: "+919973884727 ",
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
  sendSMSForHotelBookingConfirmation: async (data) => {
    const recipientPhoneNumber = `${data.phone.country_code} ${data.phone.mobile_number}`; // The passenger's phone number
    const message =
      `Hello ${data.firstName} ${data.lastName},\n\n` +
      `Thank you for booking your hotel stay with The Skytrails. Your reservation is confirmed! Here are the details:\n\n` +
      `Booking Reference: ${data.bookingReference}\n` +
      `Check-in Date: ${data.checkInDate}\n` +
      `Check-out Date: ${data.checkOutDate}\n` +
      `Hotel Name: ${data.hotelName}\n` +
      `Room Type: ${data.roomType}\n` +
      `Number of Guests: ${data.numberOfGuests}\n` +
      `Total Price: ${data.totalPrice} USD\n\n` +
      `If you have any questions or need to make changes to your reservation, please contact our customer support at [Customer Support Phone Number].\n\n` +
      `We hope you enjoy your stay at ${data.hotelName}!\n\n` +
      `Safe travels!`;

    client.messages
      .create({
        body: message,
        from: YOUR_TWILIO_PHONE_NUMBER,
        to: "+919973884727 ",
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
  sendSMSForBusBookingConfirmation: async (data) => {
    const recipientPhoneNumber = `${data.phone.country_code} ${data.phone.mobile_number}`; // The passenger's phone number
    const message =
      `Hello ${data.firstName} ${data.lastName},\n\n` +
      `Thank you for booking your bus ticket with The Sky Bus Company. Your booking is confirmed! Here are the details:\n\n` +
      `Booking Reference: ${data.bookingReference}\n` +
      `Departure Date & Time: ${data.departureDateTime}\n` +
      `Departure Location: ${data.departureLocation}\n` +
      `Arrival Location: ${data.arrivalLocation}\n` +
      `Seat Number: ${data.seatNumber}\n\n` +
      `Please arrive at the departure location at least 30 minutes before departure.\n\n` +
      `For any inquiries or changes to your booking, please contact our customer support at [Customer Support Phone Number].\n\n` +
      `We wish you a pleasant journey with The Sky Bus Company!\n\n` +
      `Safe travels!`;

    client.messages
      .create({
        body: message,
        from: YOUR_TWILIO_PHONE_NUMBER,
        to: "+919973884727",
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
  sendSMSForOtp: async (mobileNumber, otp) => {
    const messageContent = `Use this OTP ${otp} to login to your. theskytrails account`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },
  sendSMSForHotelBooking:async(data)=>{
    const urldata="https://www.google.com/"
    const details=`Hello ${data.name} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:${urldata}. Or You Can login theskytrails.com/login`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid2,
      number: data.phoneNumber.mobile_number,
      message: details,
    };
    try {
      console.log("url,{params:params==========", url, params);
      const response = await axios.get(url, { params: params });
      console.log("=====================", response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },
  sendSMSForFlightBooking: async (data) => {
     const userName=`${data?.passengerDetails[0]?.firstName} ${data?.passengerDetails[0]?.lastName}`
    const url1='google';
    const phone=data?.passengerDetails[0]?.ContactNo;
    console.log("Phone: " , phone);
    const details = `Hello,${userName}.We appreciate your flight booking with The Skytrails. Your booking has been verified! Click the following link to view details:https://theskytrails.com/${url1}`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid1,
      number: phone,
      message: details,
    };
    try {
      console.log("url,{params:params==========", url, params);
      const response = await axios.get(url, { params: params });
      console.log("=====================", response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },
  sendSMSBusBooking:async(data,name)=>{
    const details=`Hello, ${name}.We appreciate your Bus booking with The Skytrails. Your booking has been verified! Click the following link to view details= https://theskytrails.com/google`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid3,
      number: data,
      message: details,
    };
    try {
      console.log("url,{params:params==========", url, params);
      const response = await axios.get(url, { params: params });
      console.log("=====================", response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },
  sendSMSForFlightBookingAgent:async(data)=>{
    const userName=data.passengerDetails[0].firstName+" "+data.passengerDetails[0].lastName;
    const details = `Hello,${userName}.We appreciate your flight booking with The Skytrails. Your booking has been verified! Click the following link to view details:https://theskytrails.com/google`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid1,
      number: data.passengerDetails[0].ContactNo,
      message: details,
    };
    try {
      console.log("url,{params:params==========", url, params);
      const response = await axios.get(url, { params: params });
      console.log("=====================", response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },
  sendSMSBusBookingAgent:async(data)=>{
    const name=`${data.passenger[0]?.title} ${data.passenger[0]?.firstName} ${data.passenger[0]?.lastName}`;
    const phone=`${data.passenger[0]?.Phone}`;
    const details=`Hello, ${name}.We appreciate your Bus booking with The Skytrails. Your booking has been verified! Click the following link to view details= https://theskytrails.com/google`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid3,
      number: phone,
      message: details,
    };
    try {
      console.log("url,{params:params==========", url, params);
      const response = await axios.get(url, { params: params });
      console.log("=====================", response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },
  sendSMSForHotelBookingAgent:async(data)=>{
    const urldata="https://www.google.com/"
    const details=`Hello ${data.name} ,Thank you for booking your hotel stay with TheSkytrails. Your reservation is confirmed! Please click on url to see details:${urldata}. Or You Can login theskytrails.com/login`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: templateid2,
      number: data.phone,
      message: details,
    };
    try {
      console.log("url,{params:params==========", url, params);
      const response = await axios.get(url, { params: params });
      console.log("=====================", response.data);
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },

  sendSMSForSubAdmin: async (mobileNumber, otp) => {
    const messageContent = `Welcome to TheSkyTrails, and check your mail for login credential your mail is: ${otp} to login to your account https://b2b.theskytrails.com/subAdminLogin`;
    const url = `http://sms.txly.in/vb/apikey.php?`;
    const params = {
      apikey: key,
      senderid: senderid,
      templateid: subAdmintemplateid,
      number: mobileNumber,
      message: messageContent,
    };
    try {
      const response = await axios.get(url, { params: params });
      return response.data;
    } catch (error) {
      console.error("Error occurred in axios request:", error);
      throw error;
    }
  },

};
