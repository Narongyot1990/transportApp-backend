const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
    type: String,
    head: {
      plateNumber: String,
      code: String,
      vehicleRegistration: {
        date: Date,
        fileURL: String,
      },
      CMInsurance: {
        expireDate: Date,
        fileURL: String,
      },
      vehicleInsurance: {
        expireDate: Date,
        fileURL: String,
      },
      cargoInsurance: {
        expireDate: Date,
        fileURL: String,
      },
    },
    trailer: {
      plateNumber: String,
      code: String,
      vehicleRegistration: {
        date: Date,
        fileURL: String,
      },
      vehicleInsurance: {
        expireDate: Date,
        fileURL: String,
      },
      cargoInsurance: {
        expireDate: Date,
        fileURL: String,
      },
    },
}, {
    timestamps: true,
});
const Truck = mongoose.model('Truck', truckSchema);

module.exports = { Truck, truckSchema };