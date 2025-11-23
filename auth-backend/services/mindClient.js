const axios = require('axios');

const MIND_BACKEND_URL = process.env.MIND_BACKEND_URL || 'http://localhost:5000';

const mindClient = axios.create({
  baseURL: MIND_BACKEND_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function generateRecommendations(payload = {}) {
  try {
    const { data } = await mindClient.post('/api/recommendations', payload);
    return data;
  } catch (error) {
    console.error('Mind backend recommendation error:', error.message);
    if (error.response?.data) {
      console.error('Mind backend response:', error.response.data);
    }
    return null;
  }
}

module.exports = {
  generateRecommendations
};

