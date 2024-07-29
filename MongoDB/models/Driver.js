const mongoose = require('mongoose');
const { truckSchema } = require('./Truck');

const driverSchema = new mongoose.Schema({
    name: String,
    contact: {
        phone: String,
        email: String,
        address: String,
    },
    personal: {
        sex: String,
        birthdate: Date,
        avatarURL: String,
        fileURL: [String],
    },
    operationZone: {
        region: [String],
        province: [String],
    },
    drivingLicense: {
        licenseId: { type: String },
        type: { type: String },
        expire: { type: Date }
    }, 
    truck: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Truck' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    associatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

driverSchema.index({ username: 1 }, { unique: true, sparse: true });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = { Driver };
