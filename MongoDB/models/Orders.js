const mongoose = require('mongoose');
const { customerSchema } = require('../models/Customer')

const coordinatesSchema = new mongoose.Schema({
    lat: Number,
    lng: Number
});

const dataSchema = new mongoose.Schema({
    durationValue: Number,
    distanceValue: Number,
    startAddress: String,
    endAddress: String
});

const workOrderSchema = new mongoose.Schema({
    truck: String,
    labor: String,
    product: String,
    weight: String,
    origin: coordinatesSchema,
    destination: coordinatesSchema,
    originDate: Date,
    originTime: String,
    destinationDate: Date,
    destinationTime: String,
    originAddress: String,
    destinationAddress: String,
    remark: String,
    distance: String,
    duration: String,
    data: dataSchema
});

  const jobOrderSchema = new mongoose.Schema({
    jobNumber: String,
    jobDate: String,
    jobTime: String,
    customer: customerSchema,
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    workOrder: [workOrderSchema],
    prepareBy: String,
    type: String,
    status: String
}, {
    timestamps: true
});

const JobOrder = mongoose.model('JobOrder', jobOrderSchema);

module.exports = { JobOrder };
