const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Administrator', 'SuperUser', 'User', 'Other'],
        default: 'User'
    },
    profile: {
        firstname: String,
        lastname: String,
        dateOfBirth: Date,
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        },
        phoneNumber: String,
        avatarURL: String,
        bio: String,
        socialMediaLinks: {
            twitter: String,
            facebook: String,
            instagram: String,
            linkedin: String
        }
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
