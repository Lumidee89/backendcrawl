const mongoose = require('mongoose');

const domainDetailsSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true
    },
    whoisData: {
        type: Object,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const DomainDetails = mongoose.model('DomainDetails', domainDetailsSchema);

module.exports = DomainDetails;