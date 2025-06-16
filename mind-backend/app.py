from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
import requests
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import re
from typing import List, Dict, Any, Optional

app = Flask(__name__)
CORS(app)

# Ollama API configuration
OLLAMA_API_BASE = "http://localhost:11434/api"
MODEL_NAME = "gemma3:1b"  # The model you pulled from Ollama

# Load the existing FAISS index and documents
def load_resources():
    # Load the FAISS index
    if os.path.exists("mind_index.faiss"):
        index = faiss.read_index("mind_index.faiss")
    else:
        raise FileNotFoundError("FAISS index not found. Run build_index.py first.")
    
    # Load the documents
    if os.path.exists("mind_docs.txt"):
        with open("mind_docs.txt", "r") as f:
            documents = [line.strip() for line in f.readlines()]
    else:
        raise FileNotFoundError("Documents file not found. Run build_index.py first.")
    
    # Initialize the sentence transformer model
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    return index, documents, model

index, documents, model = load_resources()

def search_faiss(query: str, k: int = 3) -> List[str]:
    """Search the FAISS index for similar documents to the query."""
    query_embedding = model.encode([query], convert_to_tensor=False)
    distances, indices = index.search(np.array(query_embedding), k)
    
    results = []
    for idx in indices[0]:
        if idx < len(documents):
            results.append(documents[idx])
    
    return results

def query_ollama(prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
    """Query the Ollama API with the given prompt."""
    headers = {"Content-Type": "application/json"}
    data = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    
    if system_prompt:
        data["system"] = system_prompt
    
    response = requests.post(f"{OLLAMA_API_BASE}/generate", headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Failed to query Ollama: {response.text}"}

def is_roman_urdu(text: str) -> bool:
    """
    Detect if text is likely Roman Urdu based on common patterns and words.
    This is a simple heuristic approach and not 100% accurate.
    """
    # Common Roman Urdu words and patterns
    urdu_patterns = [
        'kya', 'hai', 'aap', 'main', 'hoon', 'kaise', 'kaisa', 'ap', 'tum', 'mein',
        'kia', 'ho', 'ka', 'ki', 'se', 'ko', 'ne', 'keh', 'aur', 'per', 'par',
        'jee', 'ji', 'han', 'nahi', 'bilkul', 'bohat', 'bohot', 'theek', 'thik',
        'shukriya', 'mehrbani', 'acha', 'accha', 'salaam', 'assalam', 'walaikum',
        'kuch', 'karna', 'raha', 'gaye', 'tha', 'hai', 'hain', 'hogya', 'huwa',
        'mujhe', 'tumhe', 'apko', 'apka', 'mera', 'hamara', 'ye', 'yeh', 'wo', 'woh'
    ]
    
    # Convert to lowercase and split into words
    words = text.lower().split()
    
    # Count words that match Roman Urdu patterns
    urdu_word_count = sum(1 for word in words if word in urdu_patterns)
    
    # If more than 20% of words match patterns, likely Roman Urdu
    return urdu_word_count / max(len(words), 1) > 0.2

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze the sentiment of the user's message using Ollama."""
    # For very short messages or greetings, don't do sentiment analysis
    if len(text.split()) < 5:
        return {
            "sentiment": "neutral",
            "emotions": []
        }
    
    prompt = f"""Analyze the sentiment in this text as concisely as possible:
    1. Categorize overall sentiment as: 'very negative', 'negative', 'neutral', 'positive', or 'very positive'
    2. List up to 2 dominant emotions (like sadness, anxiety, joy, etc.)
    
    Format as simple JSON: {{"sentiment": "category", "emotions": ["emotion1", "emotion2"]}}
    
    Text: "{text}"
    """
    
    system_prompt = "You are a focused sentiment analyzer. Respond ONLY with the requested JSON format - nothing else."
    
    response = query_ollama(prompt, system_prompt)
    result_text = response.get("response", "")
    
    # Try to extract JSON from the response
    try:
        # Clean the text first to handle common formatting issues
        cleaned_text = result_text.replace('```json', '').replace('```', '').strip()
        
        # Find JSON pattern in the response
        json_match = re.search(r'{[\s\S]*}', cleaned_text)
        if json_match:
            json_str = json_match.group(0)
            sentiment_data = json.loads(json_str)
            return sentiment_data
        else:
            # Simplified fallback for robustness
            return {
                "sentiment": "neutral" if "negative" not in result_text.lower() else "negative",
                "emotions": []
            }
    except Exception as e:
        print(f"Error parsing sentiment: {e}")
        print(f"Raw response: {result_text}")
        return {
            "sentiment": "neutral",
            "emotions": []
        }

@app.route('/', methods=['GET'])
def root():
    """Root endpoint that provides basic API information."""
    return jsonify({
        "name": "MIND Helper API",
        "description": "Mental wellness assistant API using Ollama and FAISS",
        "version": "1.0",
        "endpoints": {
            "/": "This information page",
            "/api/chat": "POST - Send a message to chat with the AI",
            "/api/health": "GET - Check the health of the API and Ollama connection"
        },
        "status": "online"
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400
    
    user_message = data['message']
    
    # Detect if the message is in Roman Urdu
    is_urdu = is_roman_urdu(user_message)
    
    # Analyze sentiment
    sentiment_analysis = analyze_sentiment(user_message)
    
    # Get relevant documents based on the user's message
    relevant_docs = search_faiss(user_message)
    
    # Create a context from relevant documents
    context = "\n".join(relevant_docs)
    
    # Create a prompt with the context
    system_prompt = """You are Emma, a friendly and empathetic mental health companion. 
    Keep your responses concise (2-3 sentences maximum), conversational, and natural like a supportive friend.
    Add a touch of warmth and personality - use casual language, occasional emojis, and conversational phrases.
    For simple greetings, respond naturally without clinical language.
    Never claim to be a doctor or therapist, but draw from evidence-based techniques when appropriate.
    If the user expresses serious issues like suicidal thoughts, encourage them to seek professional help immediately.
    
    IMPORTANT: If the user writes in Roman Urdu (Urdu written with Latin script), respond in the same Roman Urdu style.
    Match their language style, vocabulary, and informal conversational tone when replying in Roman Urdu."""
    
    # Check message type
    greeting_phrases = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "what's up", 
                       "aoa", "salam", "assalamualaikum", "assalam o alaikum", "salam", "kya hal hai", "kaise ho"]
    about_bot_phrases = ["who are you", "what are you", "how do you work", "what is this", "what can you do", 
                         "tell me about yourself", "who created you", "what's your name", "what is your name",
                         "tum kon ho", "ap kon ho", "tum kya ho", "ap kya ho", "tumhara nam kya hai", "ap ka nam kya hai"]
    
    is_simple_greeting = any(greeting in user_message.lower() for greeting in greeting_phrases) and len(user_message.split()) < 5
    is_about_bot = any(phrase in user_message.lower() for phrase in about_bot_phrases)
    
    # Language instruction based on detected language
    language_instruction = ""
    if is_urdu:
        language_instruction = "The user is writing in Roman Urdu. RESPOND IN ROMAN URDU using similar casual style and vocabulary. "
        language_instruction += "Use friendly, conversational Roman Urdu phrases and expressions like 'Kya haal hai', 'Aap kaise hain', etc."
    
    # Determine the appropriate prompt based on message content
    if is_about_bot:
        # For questions about the bot itself
        prompt = f"""{language_instruction}The user is asking about who you are or how you work.
        
        Respond in a friendly, concise way (2-3 sentences). Explain that you're Emma, a supportive AI companion 
        built to provide mental wellness support through conversation. Mention that you can listen, offer suggestions
        based on evidence-backed wellness practices, and provide a friendly space to talk.
        Keep it simple, warm and conversational."""
    elif is_simple_greeting:
        # For simple greetings, keep it natural and ask about their day
        prompt = f"""{language_instruction}The user said: "{user_message}"
        
        Respond in a warm, friendly manner like a thoughtful friend would. Acknowledge their greeting and ask about their day or how they're feeling.
        Keep it short (1-2 sentences) and conversational, like texting a friend."""
    elif 'negative' in sentiment_analysis.get('sentiment', '').lower():
        prompt = f"""{language_instruction}The user seems to be expressing negative emotions. They said: "{user_message}"
        
        Based on this relevant information:
        {context}
        
        Respond like a supportive friend in 2-3 short sentences. First, briefly acknowledge their feelings with empathy, then offer one specific helpful suggestion.
        Be conversational and natural - like texting a supportive friend."""
    else:
        prompt = f"""{language_instruction}The user said: "{user_message}"
        
        Based on this relevant information (if applicable):
        {context}
        
        Respond in a conversational, warm tone in 2-3 short sentences maximum. Be natural and friendly, like texting a good friend."""
    
    # Query Ollama
    response = query_ollama(prompt, system_prompt)
    
    # Get response text
    response_text = response.get("response", "I'm sorry, I couldn't process your request.")
    
    # Clean up response to remove any markdown formatting or unnecessary prefixes
    cleaned_response = response_text
    # Remove any "AI:" or "Emma:" prefixes that might appear
    cleaned_response = re.sub(r'^(AI:|Emma:)\s*', '', cleaned_response)
    # Remove markdown code blocks
    cleaned_response = re.sub(r'```[\s\S]*?```', '', cleaned_response)
    
    # For Roman Urdu, use different sentence splitting - periods followed by spaces,
    # but also consider '!' and '?' as sentence separators
    if is_urdu:
        # Trim to a reasonable length if it's too verbose
        if len(cleaned_response.split()) > 80:  # If more than ~80 words
            sentences = re.split(r'(?<=[.!؟?])\s+', cleaned_response)
            if len(sentences) > 3:
                cleaned_response = ' '.join(sentences[:3]) + '.'
    else:
        # Trim to a reasonable length for English
        if len(cleaned_response.split()) > 80:  # If more than ~80 words
            sentences = re.split(r'(?<=[.!?])\s+', cleaned_response)
            if len(sentences) > 3:
                cleaned_response = ' '.join(sentences[:3]) + '.'
    
    # Prepare the response
    result = {
        "response": cleaned_response.strip(),
        "sentiment": sentiment_analysis,
        "sources": relevant_docs,
        "language": "roman_urdu" if is_urdu else "english"
    }
    
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint to check if the server is running and Ollama is available."""
    try:
        # Check if Ollama API is accessible
        response = requests.get(f"{OLLAMA_API_BASE}/tags")
        if response.status_code == 200:
            ollama_status = "available"
            models = response.json().get("models", [])
            available_models = [model["name"] for model in models]
        else:
            ollama_status = "unavailable"
            available_models = []
        
        return jsonify({
            "status": "healthy",
            "ollama_status": ollama_status,
            "available_models": available_models,
            "current_model": MODEL_NAME
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)