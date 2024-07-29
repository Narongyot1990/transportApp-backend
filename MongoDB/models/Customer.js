const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    company: String,
    contact: {
        email: String,
        address: String,
        phone: String,
        fax: String,
        taxId: String,
        addressBilling: String,
    },
    personInCharge: [{
        firstname: String,
        lastname: String,
        phone: String,     
        email: String,     
    }],
    business: String
}, {
    timestamps: true,
});
const Customer = mongoose.model('Customer', customerSchema)

module.exports = { Customer, customerSchema };