// Sentiment Analysis service for MIND chatbot
// Analyzes user input to detect emotions and sentiment

import { analyzeSentimentWithHF } from './huggingfaceService';

/**
 * In a production environment:
 * - This uses Hugging Face models for more accurate sentiment analysis
 * - It has a fallback to a simpler local analysis if API calls fail
 */

// Main sentiment analysis function with Hugging Face
export async function analyzeSentiment(text) {
  try {
    // Try using Hugging Face for sentiment analysis
    return await analyzeSentimentWithHF(text);
  } catch (error) {
    console.error("Error with Hugging Face sentiment analysis, falling back to local:", error);
    // Fallback to local sentiment analysis if API call fails
    return analyzeLocalSentiment(text);
  }
}

// Simple local sentiment analysis as fallback
function analyzeLocalSentiment(text) {
  // Convert text to lowercase for simpler matching
  const textLower = text.toLowerCase();
  
  // Define emotion keywords
  const emotions = {
    joy: ['happy', 'joy', 'excited', 'glad', 'wonderful', 'great', 'amazing', 'delighted', 'pleased', 'good'],
    sadness: ['sad', 'unhappy', 'miserable', 'depressed', 'down', 'blue', 'upset', 'heartbroken', 'disappointed'],
    anger: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'furious', 'enraged', 'outraged'],
    fear: ['afraid', 'scared', 'fearful', 'terrified', 'anxious', 'worried', 'nervous', 'panicked', 'stressed'],
    disgust: ['disgusted', 'gross', 'revolting', 'repulsed', 'sick', 'nauseated'],
    neutral: ['ok', 'okay', 'fine', 'alright', 'neutral']
  };
  
  // Count emotion word matches
  const emotionCounts = {};
  Object.keys(emotions).forEach(emotion => {
    emotionCounts[emotion] = 0;
    emotions[emotion].forEach(word => {
      // Count word occurrences with word boundary check
      const regex = new RegExp('\\b' + word + '\\b', 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        emotionCounts[emotion] += matches.length;
      }
    });
  });
  
  // Determine primary emotion
  let primaryEmotion = 'neutral';
  let maxCount = 0;
  Object.keys(emotionCounts).forEach(emotion => {
    if (emotionCounts[emotion] > maxCount) {
      maxCount = emotionCounts[emotion];
      primaryEmotion = emotion;
    }
  });
  
  // Calculate overall sentiment score (-1 to 1)
  // Positive emotions: joy
  // Negative emotions: sadness, anger, fear, disgust
  // Neutral: neutral
  let sentimentScore = 0;
  
  // If we found any emotional words
  if (maxCount > 0) {
    switch (primaryEmotion) {
      case 'joy':
        sentimentScore = 0.5 + Math.min(emotionCounts.joy * 0.1, 0.5);
        break;
      case 'sadness':
        sentimentScore = -0.3 - Math.min(emotionCounts.sadness * 0.1, 0.7);
        break;
      case 'anger':
        sentimentScore = -0.6 - Math.min(emotionCounts.anger * 0.1, 0.4);
        break;
      case 'fear':
        sentimentScore = -0.4 - Math.min(emotionCounts.fear * 0.1, 0.6);
        break;
      case 'disgust':
        sentimentScore = -0.5 - Math.min(emotionCounts.disgust * 0.1, 0.5);
        break;
      default:
        sentimentScore = 0;
    }
  }
  
  // Check for negations that could flip sentiment
  const negations = ['not', 'no', "don't", "doesn't", "didn't", "haven't", "hasn't", "won't", "wouldn't", "couldn't", "shouldn't"];
  let negationCount = 0;
  negations.forEach(negation => {
    const regex = new RegExp('\\b' + negation + '\\b', 'gi');
    const matches = textLower.match(regex);
    if (matches) {
      negationCount += matches.length;
    }
  });
  
  // If odd number of negations, potentially flip the sentiment
  if (negationCount % 2 !== 0 && primaryEmotion !== 'neutral') {
    sentimentScore = -sentimentScore;
    
    // Also adjust the primary emotion if sentiment flipped
    if (primaryEmotion === 'joy') {
      primaryEmotion = 'sadness';
    } else if (primaryEmotion === 'sadness') {
      primaryEmotion = 'joy';
    }
  }
  
  return {
    primaryEmotion,
    sentimentScore,
    emotionBreakdown: emotionCounts
  };
}

// Analyze text and detect if user might need urgent help
export function detectCrisis(text) {
  const textLower = text.toLowerCase();
  
  // Crisis keywords
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'take my life', 'die', 'death', 
    'self harm', 'hurt myself', 'cutting myself', 'no reason to live'
  ];
  
  // Check for crisis indicators
  let isCrisis = false;
  let matchedKeywords = [];
  
  crisisKeywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      isCrisis = true;
      matchedKeywords.push(keyword);
    }
  });
  
  return {
    isCrisis,
    matchedKeywords,
    urgencyLevel: isCrisis ? 'high' : 'normal'
  };
}
