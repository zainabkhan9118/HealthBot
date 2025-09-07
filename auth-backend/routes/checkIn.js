const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getCheckIns, getCheckIn, createCheckIn, updateCheckIn, deleteCheckIn } = require('../controllers/checkInController');

// @route   GET api/check-ins
// @desc    Get all user's check-ins
// @access  Private
router.get('/', protect, getCheckIns);

// @route   GET api/check-ins/:id
// @desc    Get a specific check-in
// @access  Private
router.get('/:id', protect, getCheckIn);

// @route   POST api/check-ins
// @desc    Create a new check-in
// @access  Private
router.post('/', protect, createCheckIn);

// @route   PUT api/check-ins/:id
// @desc    Update a check-in
// @access  Private
router.put('/:id', protect, updateCheckIn);

// @route   DELETE api/check-ins/:id
// @desc    Delete a check-in
// @access  Private
router.delete('/:id', protect, deleteCheckIn);

module.exports = router;
