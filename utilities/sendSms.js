const twilio = require("twilio");

const TWILIO_ACCOUNT_SID = "AC1d054c048e824d5901cb75de99db3938";
const TWILIO_AUTH_TOKEN = "0522a6beb1d8f3418a72988eae4e0196";
const YOUR_TWILIO_PHONE_NUMBER = "+12248882704";

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

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
      `Hello ${data.firstName} ${data. lastName},\n\n` +
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
        to: "+919973884727 ",
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
};
