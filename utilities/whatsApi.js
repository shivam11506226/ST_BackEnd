const axios = require('axios');

async function sendWhatsAppMessage( mobileNumbers, message) {
    try {
        const whatsappAPIUrl = 'https://api.bulkwhatsapp.net/wapp/api/send';
        const apiKey = 'c255bc3cfea34fe588a61dc3c1fe642e';
        const mobileNumbers = '9135219071,8795199555';
        const message = 'hello sir';
        const response = await axios.get(`${whatsappAPIUrl}?apikey=${apiKey}&mobile=${mobileNumbers}&msg=${message}`);
        
        
        console.log('WhatsApp API Response:', response.data);
        return response.data;
    } catch (error) {
        
        console.error('Error in WhatsApp API:', error);
        throw error;
    }
}

module.exports = { sendWhatsAppMessage };
