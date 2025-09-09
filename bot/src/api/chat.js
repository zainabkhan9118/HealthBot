import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Get config with authorization headers
const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token ? token : '',
    },
  };
};

// Get all chat messages for the logged-in user
export const getUserChatMessages = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/chat/messages`, getConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Save a user message
export const saveUserMessage = async (content) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/chat/messages/user`,
      { content },
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Save an assistant message with sentiment and sources
export const saveAssistantMessage = async (content, sentiment, sources) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/chat/messages/assistant`,
      { content, sentiment, sources },
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Clear chat history
export const clearChatHistory = async () => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/chat/messages`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
