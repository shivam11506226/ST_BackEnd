const axios = require('axios');

async function sendWhatsAppMessage( number, msg) {
    try {
        const whatsappAPIUrl = 'https://api.bulkwhatsapp.net/wapp/api/send';
        const apiKey = 'c255bc3cfea34fe588a61dc3c1fe642e';
        const mobileNumbers = number;
        const message = msg;
        const response = await axios.get(`${whatsappAPIUrl}?apikey=${apiKey}&mobile=${mobileNumbers}&msg=${message}`);
        return response.data;
    } catch (error) {
        console.error('Error in WhatsApp API:', error);
        throw error;
    }
}

module.exports = { sendWhatsAppMessage };
