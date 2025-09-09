const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getChatMessages,
  saveUserMessage,
  saveAssistantMessage,
  clearChatHistory
} = require('../controllers/chat');

// @route   GET api/chat/messages
// @desc    Get all user's chat messages
// @access  Private
router.get('/messages', protect, getChatMessages);

// @route   POST api/chat/messages/user
// @desc    Save a user message
// @access  Private
router.post('/messages/user', protect, saveUserMessage);

// @route   POST api/chat/messages/assistant
// @desc    Save an assistant message with sentiment and sources
// @access  Private
router.post('/messages/assistant', protect, saveAssistantMessage);

// @route   DELETE api/chat/messages
// @desc    Clear chat history
// @access  Private
router.delete('/messages', protect, clearChatHistory);

module.exports = router;
