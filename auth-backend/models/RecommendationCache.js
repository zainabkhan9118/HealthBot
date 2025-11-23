const mongoose = require('mongoose');

const recommendationCacheSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    suggestions: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    actionPlan: {
      type: Array,
      default: []
    },
    weeklySummary: {
      type: String,
      default: ''
    },
    resourceSummary: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RecommendationCache', recommendationCacheSchema);


