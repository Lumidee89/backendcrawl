import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  adSlots: [
    { position: String, size: String, recommended: Boolean }
  ],
  metrics: {
    impressions: Number,
    clicks: Number,
    ctr: Number,
    revenue: Number
  },
  placements: [
    { page: String, recommendation: String }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Ad = mongoose.model('Ad', AdSchema);

export default Ad;