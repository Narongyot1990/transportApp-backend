const axios = require('axios');

const verifyRecaptcha = async (recaptchaResponse, userIP) => {
    try {
        const secretKey = '6LcwRNcnAAAAAOOBXsgrVUD5CLxAIB9FBTBsvhwq';
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}&remoteip=${userIP}`;
        
        const response = await axios.post(verificationURL);
        return response.data.success; // true if validation passed, false otherwise
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
}

module.exports = verifyRecaptcha;