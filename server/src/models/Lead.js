const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  rating: {
    type: String,
    default: 'N/A'
  },
  score: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  services: [{
    type: String,
    trim: true
  }],
  emailPattern: {
    type: String,
    trim: true
  },
  ownerName: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: true }
});

leadSchema.index({ jobId: 1, score: 1 });

module.exports = mongoose.model('Lead', leadSchema);