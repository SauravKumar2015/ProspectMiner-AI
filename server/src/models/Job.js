const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  query: {
    type: String,
    required: [true, 'Query is required'],
    trim: true
  },
  limit: {
    type: Number,
    required: true,
    min: 1,
    max: 500
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  leadCount: {
    type: Number,
    default: 0
  },
  creditsSpent: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: true }
});

jobSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);