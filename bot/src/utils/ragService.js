// RAG (Retrieval-Augmented Generation) service for MIND chatbot
// Handles the retrieval of relevant information and generation of responses

import { retrieveRelevantContent, formatContextForLLM } from './embeddingUtils';

/**
 * RAG Process:
 * 1. Take user input
 * 2. Retrieve relevant information from knowledge base
 * 3. Use retrieved information to augment the prompt for the language model
 * 4. Generate a response based on the augmented prompt
 */

// Import Hugging Face service
import { generateText } from './huggingfaceService';

// Main RAG function for generating responses
export async function generateRAGResponse(userInput, userHistory = []) {
  try {
    // Step 1: Retrieve relevant information from the knowledge base
    const retrievedContent = retrieveRelevantContent(userInput);
    
    // Step 2: Format the retrieved content for prompt augmentation
    const formattedContext = formatContextForLLM(retrievedContent);
    
    // Step 3: Create the prompt for the language model
    const prompt = createAugmentedPrompt(userInput, formattedContext, userHistory);
    
    // Step 4: Generate the response using Hugging Face
    let response;
    try {
      response = await generateText(prompt, {
        temperature: 0.7,
        maxTokens: 300
      });
    } catch (error) {
      console.error("Error with Hugging Face API:", error);
      // Fallback to mock response if API call fails
      response = await mockLLMResponse(prompt);
    }
    
    return {
      text: response,
      sources: retrievedContent.map(item => ({
        type: item.type,
        id: item.data.id,
        title: item.type === 'resource' ? item.data.category : item.data.problem
      }))
    };
  } catch (error) {
    console.error("Error generating RAG response:", error);
    return {
      text: "I apologize, but I'm having trouble processing your request right now. Could you try again?",
      sources: []
    };
  }
}

// Create an augmented prompt with context for the language model
function createAugmentedPrompt(userInput, context, userHistory) {
  // Format conversation history
  const conversationHistory = userHistory.map(msg => 
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
  ).join('\n');
  
  // Construct the prompt with system instructions, context, history, and user input
  return `
You are MIND, an empathetic mental health assistant designed to provide support and guidance.
Your responses should be supportive, non-judgmental, and tailored to the user's emotional needs.
Use the following relevant information to inform your response, but don't directly reference that you're using this information.

${context}

CONVERSATION HISTORY:
${conversationHistory}

USER INPUT: ${userInput}

Provide a helpful, empathetic response that addresses the user's concerns. If appropriate, suggest specific techniques or strategies they might find helpful, based on the retrieved information. Do not diagnose conditions or replace professional help.
`;
}

// Mock LLM response function (in production, this would call OpenAI API)
async function mockLLMResponse(prompt) {
  // Simplified response generation
  // In a real implementation, you would call:
  // const completion = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [{ role: "system", content: prompt }],
  //   max_tokens: 300
  // });
  // return completion.choices[0].message.content;
  
  // For demo, we'll return a simple response based on detected keywords
  if (prompt.toLowerCase().includes('anxiety')) {
    return "I understand that anxiety can feel overwhelming. Taking slow, deep breaths can help calm your nervous system in the moment. Try breathing in for 4 counts, holding for 2, and exhaling for 6. This can help activate your parasympathetic nervous system. Would you like to try more techniques like this together?";
  } else if (prompt.toLowerCase().includes('depress')) {
    return "I'm sorry you're feeling this way. Depression can make everything feel more difficult. Sometimes, small steps like getting some sunlight or taking a short walk can help shift your mood slightly. Would you like to talk more about what you're experiencing?";
  } else if (prompt.toLowerCase().includes('stress')) {
    return "It sounds like you're dealing with a lot of stress right now. Taking short mindfulness breaks throughout your day can help. Even just 2-3 minutes of focusing on your breath or noticing your surroundings can create a helpful mental reset. What specific stressors are you facing today?";
  } else if (prompt.toLowerCase().includes('sleep')) {
    return "Sleep difficulties can really affect how we feel. Creating a consistent bedtime routine signals to your body it's time to wind down. You might try limiting screen time before bed, keeping your bedroom cool and dark, or practicing relaxation techniques like progressive muscle relaxation. How has your sleep been recently?";
  } else {
    return "Thank you for sharing that with me. I'm here to support you through whatever you're experiencing. Sometimes just expressing our thoughts can help provide clarity. Would you like to explore some techniques that might help with what you're feeling?";
  }
}
