const mongoose = require('mongoose');

const contentAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    website: {
        type: String,
        required: true
    },
    violations: [
        {
            url: String,
            reason: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ContentAnalysis', contentAnalysisSchema);
