const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    date: Date,
    jobType: String,
    address: String,
    location: {
      lat: Number,
      lng: Number,
    },
    remark: String,
  }, {
    timestamps: true,
  });
const Location = mongoose.model('Location', locationSchema);  

module.exports = { Location, locationSchema };