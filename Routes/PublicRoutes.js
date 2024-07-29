const express = require('express');
const router = express.Router();
const { Quote, Job, Feedback, Cookies } = require('../MongoDB/models/models');
const { bucket, upload } = require('../Storages/googleStorage');
const verifyRecaptcha = require('../Controller/verifyRecaptcha');
const transporter = require('../Controller/nodemailer');

router.post('/quote',upload.array('files', 5), async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const userIP = req.ip;
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse, userIP);
    if (!isRecaptchaValid) {
        return res.status(400).json({ message: "reCAPTCHA verification failed." });
    }

    const { 
        fullname,
        email,
        phone,
        companyName,
        serviceType,
        loadDetail,
        additionalDetail,
    } = req.body;

    if (!fullname || !email || !phone) {
        return res.status(400).json({ message: "Required fields are missing." });
    }

    try {
        let resolvedFileUrls = [];
        if (req.files && req.files.length > 0) {
            const fileURLs = req.files.map((file) => {
                const fileName = Date.now() + '-' + file.originalname;
                const blob = bucket.file(fileName);
                const blobStream = blob.createWriteStream();
    
                blobStream.end(file.buffer);
    
                return new Promise((resolve, reject) => {
                    blobStream.on('finish', () => {
                        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                        resolve(publicUrl);
                    });
    
                    blobStream.on('error', (error) => {
                        reject(error);
                    });
                });
            });

            resolvedFileUrls = await Promise.all(fileURLs);
        }

        const newQuote = new Quote({
            fullname,
            email,
            phone,
            companyName,
            serviceType,
            loadDetail,
            additionalDetail,
            files: resolvedFileUrls,
        });
        await newQuote.save();
        res.status(200).json({ message: "Thank you! We've received your quote." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Our apologies! Something went wrong on Server.', error: error.message });
    } 
});

router.post('/job', async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const userIP = req.ip;
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse, userIP);
    if (!isRecaptchaValid) {
        return res.status(400).json({ message: "reCAPTCHA verification failed." });
    }

    const {
        news,
        position,
        startDate,
        income,
        firstName,
        lastName,
        nickname,
        birthdate,
        age,
        bloodType,
        citizenship,
        currentAddress,
        email,
        fatherAge,
        fatherName,
        fatherOccupation,
        fatherStatus,
        height,
        livingWith,
        militaryStatus,
        motherAge,
        motherName,
        motherOccupation,
        motherStatus,
        nationality,
        originalAddress,
        phone,
        prefix,
        religion,
        spouseAge,
        spouseEmail,
        spouseName,
        spouseOccupation,
        spousePhone,
        spouseStatus,
        spouseWorkplace,
        weight,
    } = req.body;

    try {

        const newJob = new Job({
            news,
        position,
        startDate,
        income,
        firstName,
        lastName,
        nickname,
        birthdate,
        age,
        bloodType,
        citizenship,
        currentAddress,
        email,
        fatherAge,
        fatherName,
        fatherOccupation,
        fatherStatus,
        height,
        livingWith,
        militaryStatus,
        motherAge,
        motherName,
        motherOccupation,
        motherStatus,
        nationality,
        originalAddress,
        phone,
        prefix,
        religion,
        spouseAge,
        spouseEmail,
        spouseName,
        spouseOccupation,
        spousePhone,
        spouseStatus,
        spouseWorkplace,
        weight,
        });
        await newJob.save();
        res.status(200).json({ message: "Job application submitted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the job application.', error: error.message });
    }
});

router.post('/feedback',upload.none(), async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const userIP = req.ip;
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse, userIP);
    if (!isRecaptchaValid) {
        return res.status(400).json({ message: "reCAPTCHA verification failed." });
    }
    const {
        fullname,
        phone,
        email,
        topic,
        description,
    } = req.body;

    try {
        const newFeedback = new Feedback({
            fullname,
            phone,
            email,
            topic,
            description,
        });
        await newFeedback.save();

        const mailOptions = {
            from: 'info@siamrapid.co.th', // Sender address
            to: 'narongyot@siamrapid.co.th', // Recipient address
            subject:`${req.body.email}, ${req.body.phone} : ${req.body.topic}`, // Subject of the email
            text: description // Email content
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Feedback submitted sucessfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the feedback.', error: error.message });
    }
})

router.post('/cookies', async (req, res) => {
    const { 
        ip,
        city,
        region,
        country,
        country_name,
        ...rest // contains other fields
    } = req.body;

    // Validate the data here if necessary

    try {
        const newCookies = new Cookies({
            ipAddress: ip, 
            location: {
                city,
                region,
                country: country_name // using the full country name here
            },
            ...rest
        });

        await newCookies.save();
        return res.status(200).json({ message: "Accept cookies successfully.", cookies: newCookies });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});


module.exports = router;