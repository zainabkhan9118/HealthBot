const JournalEntry = require('../models/JournalEntry');

// @desc    Get all journal entries for the logged in user
// @route   GET /api/journal
// @access  Private
exports.getJournalEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add a new journal entry
// @route   POST /api/journal
// @access  Private
exports.addJournalEntry = async (req, res) => {
  try {
    const { mood, text } = req.body;

    // Add user ID from the authenticated user
    const entry = await JournalEntry.create({
      userId: req.user.id,
      mood,
      text
    });

    res.status(201).json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
// @access  Private
exports.updateJournalEntry = async (req, res) => {
  try {
    const { mood, text } = req.body;
    
    // Find entry by ID
    let entry = await JournalEntry.findById(req.params.id);

    // Check if entry exists
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    // Check if user owns the entry
    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this entry'
      });
    }

    // Update the entry
    entry.mood = mood || entry.mood;
    entry.text = text || entry.text;
    await entry.save();

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Private
exports.deleteJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    // Check if entry exists
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found'
      });
    }

    // Check if user owns the entry
    if (entry.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this entry'
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
