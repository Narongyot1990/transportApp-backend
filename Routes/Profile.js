const express = require('express');
const router = express.Router();
const { User } = require('../MongoDB/models/User');
const GPSRecord = require('../MongoDB/models/GPS.record')
const authenticateToken = require('./authenticateToken')
//const verifyRecaptcha = require('../Controller/verifyRecaptcha');



// Get user's profile information
router.get('/:id',authenticateToken, async (req, res) => {

    try {
        const userId = req.params.id;
        if (userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only update your own profile." });
        }

        const user = await User.findById(userId).select('-password');  // Excluding password from the result

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Update user's profile information
router.put('/:id',authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only update your own profile." });
        }

        const updates = req.body;
        if (!updates) {
            return res.status(400).json({ message: 'Your request is missing the update data.' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true, 
            runValidators: true  // Ensures new data adheres to your schema
        }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Create a GPS record for a user
router.post('/:id/gps-record', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        if (userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only access your own GPS records." });
        }

        // Extract latitude and longitude from the request body
        const { lat, lng, displayName } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Missing latitude or longitude data.' });
        }

        // Create a new GPS record and save it
        const gpsRecord = new GPSRecord({ userId, lat, lng, displayName });
        await gpsRecord.save();

        return res.status(201).json(gpsRecord);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Fetch all GPS records for a user or all users
router.get('/:id/gps-record-all', authenticateToken, async (req, res) => {
    try {
        //const userId = req.params.id;
        
        // If you wanted to limit the endpoint only to admins or specific users, you can add a check here
        
        //let query = {};

        // If a specific user ID is provided in the request, modify the query to fetch only that user's records
        /*if (userId && userId !== 'all') {
            if (userId !== req.user._id.toString()) {
                return res.status(403).json({ message: "You can only access your own GPS records or all records." });
            }
            query.userId = userId;
        }

        const records = await GPSRecord.find(query);
        return res.status(200).json(records);*/
        const records = await GPSRecord.find();
        return res.status(200).json(records);
        

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ... the rest of your routes ...





module.exports = router;
