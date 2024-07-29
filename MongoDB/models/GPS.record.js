const mongoose = require('mongoose');

// Define the schema for the GPSRecord model
const gpsRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model, this sets up a reference to the User model
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    displayName: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now // You can set a default timestamp or modify it as needed
    }
});

// Create the GPSRecord model
const GPSRecord = mongoose.model('GPSRecord', gpsRecordSchema);

module.exports = GPSRecord;
