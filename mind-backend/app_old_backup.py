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

def search_faiss(query: str, k: int = 5) -> List[str]:
    """Search the FAISS index for similar documents to the query."""
    query_embedding = model.encode([query], convert_to_tensor=False)
    distances, indices = index.search(np.array(query_embedding), k)
    
    # Get unique results with their distances
    unique_results = {}
    for i, idx in enumerate(indices[0]):
        if idx < len(documents):
            doc = documents[idx]
            # Only add if document content is different (avoid near duplicates)
            # Use first 50 chars as a key to detect similar documents
            doc_key = doc[:50]
            if doc_key not in unique_results or distances[0][i] < unique_results[doc_key][1]:
                unique_results[doc_key] = (doc, distances[0][i])
    
    # Sort by relevance (distance) and take top results
    results = [doc for doc, _ in sorted(unique_results.values(), key=lambda x: x[1])]
    
    # Ensure we return at least 3 different sources if available
    return results[:min(5, len(results))]

def extract_json_payload(raw_text: str) -> Optional[Dict[str, Any]]:
    """Attempt to extract JSON from a model response."""
    if not raw_text:
        return None

    cleaned_text = raw_text.replace('```json', '').replace('```', '').strip()
    json_match = re.search(r'{[\s\S]*}', cleaned_text)

    if json_match:
        try:
            return json.loads(json_match.group(0))
        except Exception as err:
            print(f"JSON parse error: {err}")

    return None

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



def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze the sentiment of the user's message using Ollama."""
    # For very short messages or greetings, don't do sentiment analysis
    if len(text.split()) < 5:
        return {
            "sentiment": "neutral",
            "emotions": []
        }
    
    # Pre-check for achievement statements
    achievement_phrases = ["i landed", "i got", "i achieved", "i finished", "i completed", "i won", 
                          "i succeeded", "i passed", "i made it", "i did it", "i accomplished"]
    
    if any(phrase in text.lower() for phrase in achievement_phrases):
        # Likely a positive achievement statement
        return {
            "sentiment": "positive",
            "emotions": ["pride", "joy"]
        }
    
    prompt = f"""Analyze the sentiment in this text with particular attention to achievements and successes:
    1. Categorize overall sentiment as: 'very negative', 'negative', 'neutral', 'positive', or 'very positive'
    2. List up to 2 dominant emotions (like sadness, anxiety, joy, pride, satisfaction, etc.)
    
    Important: Messages about personal achievements, accomplishments, or good news should be categorized as 'positive' with emotions like 'pride', 'joy', or 'satisfaction'.
    
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
    
    # Get conversation history if provided
    conversation_history = data.get('conversation_history', [])
    
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
    IMPORTANT: Always remember previous messages from the conversation and maintain context with the user.
    Use their name if they've mentioned it and refer back to topics they've brought up previously."""
    
    # Check message type
    greeting_phrases = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "what's up"]
    about_bot_phrases = ["who are you", "what are you", "how do you work", "what is this", "what can you do", 
                         "tell me about yourself", "who created you", "what's your name", "what is your name"]
    
    is_simple_greeting = any(greeting in user_message.lower() for greeting in greeting_phrases) and len(user_message.split()) < 5
    is_about_bot = any(phrase in user_message.lower() for phrase in about_bot_phrases)
    
    # Set empty language instruction as we're only using English now
    language_instruction = ""
    
    # Build conversation history context first
    conversation_context = ""
    if conversation_history:
        formatted_history = []
        for msg in conversation_history[-5:]:  # Only include last 5 messages to avoid context overflow
            role = "User" if msg.get("role") == "user" else "Emma"
            formatted_history.append(f"{role}: {msg.get('content')}")
        
        if formatted_history:
            conversation_context = "Previous conversation:\n" + "\n".join(formatted_history) + "\n\n"
    
    # Determine the appropriate prompt based on message content
    if is_about_bot:
        # For questions about the bot itself
        prompt = f"""{language_instruction}The user is asking about who you are or how you work.
        
        {conversation_context}
        
        Respond in a friendly, concise way (2-3 sentences). Explain that you're Emma, a supportive AI companion 
        built to provide mental wellness support through conversation. Mention that you can listen, offer suggestions
        based on evidence-backed wellness practices, and provide a friendly space to talk.
        Keep it simple, warm and conversational."""
    elif is_simple_greeting:
        # For simple greetings, keep it natural and ask about their day
        prompt = f"""{language_instruction}The user said: "{user_message}"
        
        {conversation_context}
        
        Respond in a warm, friendly manner like a thoughtful friend would. Acknowledge their greeting and ask about their day or how they're feeling.
        Keep it short (1-2 sentences) and conversational, like texting a friend."""
    elif 'negative' in sentiment_analysis.get('sentiment', '').lower():
        prompt = f"""{language_instruction}The user seems to be expressing negative emotions. They said: "{user_message}"
        
        {conversation_context}
        
        Based on this relevant information:
        {context}
        
        Respond like a supportive friend in 2-3 short sentences. First, briefly acknowledge their feelings with empathy, then offer one specific helpful suggestion.
        Be conversational and natural - like texting a supportive friend."""
    else:
        prompt = f"""{language_instruction}The user said: "{user_message}"
        
        {conversation_context}
        
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
    
    # Trim to a reasonable length for English
    if len(cleaned_response.split()) > 80:  # If more than ~80 words
        sentences = re.split(r'(?<=[.!?])\s+', cleaned_response)
        if len(sentences) > 3:
            cleaned_response = ' '.join(sentences[:3]) + '.'
    
    # Prepare the response
    result = {
        "response": cleaned_response.strip(),
        "sentiment": sentiment_analysis,
        "sources": relevant_docs
    }
    
    return jsonify(result)


def build_context_summary(chat_history: List[Dict[str, Any]], 
                          journal_entries: List[Dict[str, Any]], 
                          check_ins: List[Dict[str, Any]]) -> str:
    """Create a readable summary of the user's recent activity for prompting."""
    segments = []

    if check_ins:
        check_text = "\n".join([
            f"- {entry.get('date', '')}: mood {entry.get('mood')} (notes: {entry.get('notes', '')})"
            for entry in check_ins[:7]
        ])
        segments.append(f"Recent mood check-ins:\n{check_text}")

    if journal_entries:
        journal_text = "\n".join([
            f"- {entry.get('date', '')}: mood {entry.get('mood')}, entry: {entry.get('text', '')[:180]}"
            for entry in journal_entries[:5]
        ])
        segments.append(f"Recent journal reflections:\n{journal_text}")

    if chat_history:
        chat_text = "\n".join([
            f"{msg.get('role', 'user').capitalize()} ({msg.get('sentiment', 'unknown')}): {msg.get('content', '')[:160]}"
            for msg in chat_history[:10]
        ])
        segments.append(f"Conversation highlights:\n{chat_text}")

    return "\n\n".join(segments) if segments else "No recent activity recorded."


def build_fallback_recommendations(check_ins: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Provide deterministic suggestions if the AI call fails."""
    latest_mood = check_ins[0].get('mood') if check_ins else "Neutral"
    mood_based_tip = {
        "Very Happy": "Channel your positive energy into helping someone else today.",
        "Happy": "Maintain momentum by noting three things that feel good right now.",
        "Neutral": "Check in with your body—notice any tension and release it slowly.",
        "Sad": "List two gentle activities that usually soothe you and pick one.",
        "Depressed": "Reach out to a trusted person or write a compassionate note to yourself."
    }.get(latest_mood, "Pause for a mindful breath and notice what you need this hour.")

    fallback = {
        "weekly_summary": f"Overall mood trend appears {latest_mood.lower() if latest_mood else 'mixed'}. Continue small, steady routines.",
        "action_plan": [
            {"title": "Morning grounding", "detail": "Spend five minutes journaling how you want to feel today.", "timeOfDay": "morning"},
            {"title": "Afternoon body check", "detail": "Stretch shoulders and neck, then take three deep breaths.", "timeOfDay": "afternoon"},
            {"title": "Evening reflection", "detail": "Write one thing you appreciated about yourself today.", "timeOfDay": "evening"}
        ],
        "suggestions": {
            "exercises": [
                {"title": "Gentle shoulder rolls", "description": "Release built-up tension in under two minutes."}
            ],
            "breathing": [
                {"title": "Box breathing", "description": "Inhale, hold, exhale, hold for four counts each to calm your nervous system."}
            ],
            "moodTips": [
                {"title": "Compassionate reminder", "description": mood_based_tip}
            ],
            "stressRelief": [
                {"title": "Digital pause", "description": "Silence notifications for 20 minutes and observe how your body responds."}
            ],
            "resources": [
                {"title": "5-minute body scan", "type": "audio", "description": "Guided relaxation for winding down.", "url": "", "tags": ["relaxation"]},
                {"title": "Expressive writing mini-guide", "type": "article", "description": "Prompt to process stuck emotions.", "url": "", "tags": ["journaling"]}
            ]
        }
    }

    return fallback


@app.route('/api/recommendations', methods=['POST'])
def generate_recommendations():
    """Provide AI-generated suggestions and plans based on user activity."""
    data = request.json or {}
    chat_history = data.get('chat_history', [])
    journal_entries = data.get('journal_entries', [])
    check_ins = data.get('check_ins', [])

    context_summary = build_context_summary(chat_history, journal_entries, check_ins)

    prompt = f"""
You are Emma, an empathetic mental health companion generating a structured wellness briefing.

Use the user's recent conversations, journaling themes, and mood check-ins to craft tailored support.

Context:
{context_summary}

Return STRICT JSON with this shape:
{{
  "weekly_summary": "2-3 sentence overview of emotional themes and wins",
  "action_plan": [
    {{"title": "...", "detail": "...", "timeOfDay": "morning|afternoon|evening"}}
  ],
  "suggestions": {{
    "exercises": [{{"title": "...", "description": "...", "duration": "optional"}}],
    "breathing": [{{"title": "...", "description": "...", "duration": "optional"}}],
    "moodTips": [{{"title": "...", "description": "..."}}],
    "stressRelief": [{{"title": "...", "description": "..."}}],
    "resources": [{{"title": "...", "type": "video|audio|article|exercise", "description": "...", "url": "", "tags": ["anxiety"] }}]
  }}
}}

Keep each list to a maximum of three concise items. Respond ONLY with JSON.
"""

    system_prompt = "You are a precise assistant. Respond exclusively with valid JSON adhering to the requested schema."

    response = query_ollama(prompt, system_prompt)
    result_text = response.get("response", "")
    ai_payload = extract_json_payload(result_text)

    if not ai_payload:
        ai_payload = build_fallback_recommendations(check_ins)

    return jsonify(ai_payload)

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