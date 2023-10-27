const twilio = require("twilio");

const accountSid = process.env.TWILIO_YOUR_ACCOUNT_SID;
const authToken = process.env.TWILIO_YOUR_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

module.exports = {
  sendSMSForFlightBookingConfirmation: (data) => {
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
        from: process.env.YOUR_TWILIO_PHONE_NUMBER,
        to: recipientPhoneNumber,
      })
      .then((message) => console.log(`Message sent with SID: ${message.sid}`))
      .catch((error) => console.error(error));
  },
};
