import mongoose from 'mongoose';

const contentAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
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

const ContentAnalysis = mongoose.model('ContentAnalysis', contentAnalysisSchema);

export default ContentAnalysis;