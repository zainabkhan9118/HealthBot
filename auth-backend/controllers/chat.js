const ChatMessage = require('../models/ChatMessage');
const { validationResult } = require('express-validator');

// @desc    Get all user's chat messages
// @route   GET /api/chat/messages
// @access  Private
exports.getChatMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user.id })
      .sort({ timestamp: 1 });
    
    return res.json(messages);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// @desc    Save a user message
// @route   POST /api/chat/messages/user
// @access  Private
exports.saveUserMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ msg: 'Message content is required' });
  }

  try {
    const newMessage = new ChatMessage({
      userId: req.user.id,
      role: 'user',
      content,
    });

    const message = await newMessage.save();
    return res.json(message);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// @desc    Save an assistant message with sentiment and sources
// @route   POST /api/chat/messages/assistant
// @access  Private
exports.saveAssistantMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content, sentiment, sources } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ msg: 'Message content is required' });
  }

  try {
    const newMessage = new ChatMessage({
      userId: req.user.id,
      role: 'assistant',
      content,
      sentiment,
      sources
    });

    const message = await newMessage.save();
    return res.json(message);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

// @desc    Clear chat history
// @route   DELETE /api/chat/messages
// @access  Private
exports.clearChatHistory = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user.id });
    return res.json({ msg: 'Chat history cleared successfully' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};
