const axios = require('axios');

async function sendWhatsAppMessage( number, msg) {
    try {
        const whatsappAPIUrl = process.env.WHATSAPP_URL
        const apiKey = process.env.WHATSAPP_API_KEY;
        const mobileNumbers = number;
        const message = msg;
        const response = await axios.get(`${whatsappAPIUrl}?apikey=${apiKey}&mobile=${mobileNumbers}&msg=${message}`);
        if(!response){
            console.log("response===========Error in uploading image");
        }
        return response.data;
    } catch (error) {
        console.error('Error in WhatsApp API:', error);
        throw error;
    }
}

module.exports = { sendWhatsAppMessage };
