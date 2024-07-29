require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { User } = require('../MongoDB/models/User');
const { Driver } = require('../MongoDB/models/Driver');



//CREATE
router.post('/register', async (req, res) => {
    const { username, email, password, registerToken } = req.body;

    if (registerToken !== process.env.KEY_SECRET_REGISTER) {
        return res.status(400).json({ message : "Invalid registertoken." });

    }

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Your request is missing some fields." });
    }

    try {
        const existUsername = await User.findOne({ $or: [{ username }, { email }] });
        const driverUsername = await Driver.findOne({ username });

        if ( existUsername ) {
            if (existUsername.username === username) {
                return res.status(400).json({ message: "This username already exists." });
            }
            if (existUsername.email === email) {
                return res.status(400).json({ message: "This email already exists." });
            }
        }

        if ( driverUsername ) {
            return res.status(400).json({user:username, message: "This email already exists." });
        }

        const saltRounds = 10; 
        bcrypt.hash(password, saltRounds, async function(err, hash) {
                if(err) {
                    return res.status(500).json({ message: "Error hashing password" });
                }

                const newUser = new User({
                    username: username,
                    email: email,
                    password: hash,
                });
                
                await newUser.save();
                res.status(200).json({ message: "User registered successfully." });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post('/login', async (req, res) => {

    /*const recaptchaResponse = req.body['g-recaptcha-response'];
    const userIP = req.ip;
    const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse, userIP);
    if (!isRecaptchaValid) {
        return res.status(400).json({ message: "reCAPTCHA verification failed." });
    }*/

    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Invalid data.' });
    }

    try {
        let user = await User.findOne({ username });
        let userType = 'user';

        if (!user) {
            user = await Driver.findOne({ username });
            userType = 'driver';
        }

        if (!user) {
            return res.status(400).json({ message: 'User or driver not found.' });
        }

        const verifyPassword = await bcrypt.compare(password, user.password);

        if (!verifyPassword) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const secretKey = process.env.TOKEN_SECRET;
        const payload = { _id: user._id };
        const expiresIn = rememberMe ? '7d' : '3d';
        const token = jwt.sign(payload, secretKey, { expiresIn });

        res.status(200).json({
            userId: user._id, 
            username: username,
            token: token, 
            expiresIn: expiresIn,
            message: "Logged in."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error signing the token' });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logout" });
});

module.exports = router