const mongoose = require('mongoose');

//Quote
const quoteSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true        
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    companyName: {
        type: String,
    },
    serviceType: {
        type: String,
    },
    loadDetail: {
        type: String,
    },
    additionalDetail: {
        type: String,
    },
    files: [{
        type: String,
    }]
    }, { 
      timestamps: true,
    });
const Quote = mongoose.model('Quote', quoteSchema);

//Job
const jobSchema = new mongoose.Schema({
    news: String,
    position: String,
    startDate: String,
    income: String,
    firstName: String,
    lastName: String,
    nickname: String,
    birthdate: Date,
    age: String,
    bloodType: String,
    citizenship: String,
    currentAddress: String,
    email: String,
    fatherAge: String,
    fatherName: String,
    fatherOccupation: String,
    fatherStatus: String,
    height: String,
    income: String,
    livingWith: String,
    militaryStatus: String,
    motherAge: String,
    motherName: String,
    motherOccupation: String,
    motherStatus: String,
    nationality: String,
    nickname: String,
    originalAddress: String,
    phone: String,
    position: String,
    prefix: String,
    religion: String,
    spouseAge: String,
    spouseEmail: String,
    spouseName: String,
    spouseOccupation: String,
    spousePhone: String,
    spouseStatus: String,
    spouseWorkplace: String,
    weight: String,
    }, { 
    timestamps: true,
    });
const Job = mongoose.model('Job', jobSchema);

const feedbackSchema = new mongoose.Schema({
    fullname: String,
    phone: String,
    email: String,
    topic: String,
    description: String,
    }, {
        timestamps: true
    });
const Feedback = mongoose.model('Feedback', feedbackSchema);

const CookieSchema = new mongoose.Schema({
    ipAddress: String,
    network: String,
    version: String,
    location: {
        city: String,
        region: String,
        country: String
    },
    region_code: String,
    country_code: String,
    country_code_iso3: String,
    country_capital: String,
    country_tld: String,
    continent_code: String,
    in_eu: Boolean,
    postal: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    utc_offset: String,
    country_calling_code: String,
    currency: String,
    currency_name: String,
    languages: String,
    country_area: Number,
    country_population: Number,
    asn: String,
    org: String,
    cookies: Boolean
});

const Cookies = mongoose.model('Cookies', CookieSchema);



module.exports = { Quote, Job, Feedback, Cookies };