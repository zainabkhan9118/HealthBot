const CheckIn = require('../models/CheckIn');
const User = require('../models/User');

// Get all check-ins for a specific user
exports.getCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ userId: req.user.id })
      .sort({ date: -1 });

    return res.json({
      success: true,
      data: checkIns
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get a specific check-in by ID
exports.getCheckIn = async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    // Make sure user owns the check-in
    if (checkIn.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    return res.json({
      success: true,
      data: checkIn
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create a new check-in
exports.createCheckIn = async (req, res) => {
  const { mood, notes, metrics } = req.body;

  try {
    const newCheckIn = new CheckIn({
      userId: req.user.id,
      mood,
      notes,
      metrics
    });

    const checkIn = await newCheckIn.save();

    return res.json({
      success: true,
      data: checkIn
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update a check-in
exports.updateCheckIn = async (req, res) => {
  const { mood, notes, metrics } = req.body;

  // Build check-in object
  const checkInFields = {};
  if (mood) checkInFields.mood = mood;
  if (notes) checkInFields.notes = notes;
  if (metrics) checkInFields.metrics = metrics;

  try {
    let checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    // Make sure user owns the check-in
    if (checkIn.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    checkIn = await CheckIn.findByIdAndUpdate(
      req.params.id,
      { $set: checkInFields },
      { new: true }
    );

    return res.json({
      success: true,
      data: checkIn
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete a check-in
exports.deleteCheckIn = async (req, res) => {
  try {
    let checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({
        success: false,
        message: 'Check-in not found'
      });
    }

    // Make sure user owns the check-in
    if (checkIn.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await CheckIn.findByIdAndRemove(req.params.id);

    return res.json({
      success: true,
      message: 'Check-in removed'
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
