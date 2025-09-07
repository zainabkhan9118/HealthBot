const mongoose = require('mongoose');

const CheckInSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: String,
    required: true,
    enum: ["Very Happy", "Happy", "Neutral", "Sad", "Depressed"]
  },
  notes: {
    type: String,
    default: ""
  },
  metrics: {
    sleep: {
      type: Number,  // Hours of sleep
      min: 0,
      max: 24
    },
    energy: {
      type: Number,  // Scale 1-10
      min: 1,
      max: 10
    },
    anxiety: {
      type: Number,  // Scale 1-10
      min: 1,
      max: 10
    }
  }
});

module.exports = mongoose.model('CheckIn', CheckInSchema);
