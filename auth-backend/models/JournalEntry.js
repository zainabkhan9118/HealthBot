const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
