const User = require('../models/User');
const bcrypt = require('bcryptjs');
const JournalEntry = require('../models/JournalEntry');

// @desc    Change user password
// @route   PUT /api/users/:id/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Make sure user is changing their own password
    if (req.params.id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change this user\'s password'
      });
    }

    // Check if the user exists
    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
