from flask import Flask, request, jsonify
from flask_cors import CORS
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import re
from typing import List, Dict, Any
import time
import requests
import google.generativeai as genai

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://bot-sooty-sigma.vercel.app", "http://localhost:*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Google Gemini API configuration (load from environment variable)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY not set in environment variables!")
    genai.configure(api_key="dummy_key")  # Placeholder to prevent crashes
    gemini_model = None
else:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.0-flash')
    print("✓ Gemini API configured")

# Configure emotion detection to use Hugging Face Inference API (no local model load)
print("Configuring emotion detection (Hugging Face Inference API)...")
HF_MODEL = os.environ.get("HF_MODEL", "zainabkhan9118/RomanUrduEmotions")
HF_TOKEN = os.environ.get("HF_TOKEN")
if HF_TOKEN:
    print(f"✓ Using Hugging Face model: {HF_MODEL} (via Inference API)")
else:
    print("⚠️ HF_TOKEN not set. Inference API will be disabled; detect_emotions will return neutral.")

# Load FAISS index and documents (optional - graceful fallback if not present)
def load_resources():
    index = None
    documents = []
    model = None
    
    if os.path.exists("data/mind_index.faiss") and os.path.exists("data/mind_docs.txt"):
        try:
            index = faiss.read_index("data/mind_index.faiss")
            with open("data/mind_docs.txt", "r") as f:
                documents = [line.strip() for line in f.readlines()]
            model = SentenceTransformer("all-MiniLM-L6-v2")
            print(f"✓ FAISS index loaded with {len(documents)} documents")
        except Exception as e:
            print(f"⚠️ Failed to load FAISS resources: {e}")
            print("   RAG functionality will be disabled, but app will continue.")
    else:
        print("⚠️ FAISS index not found. RAG functionality disabled (app will use Gemini without RAG context).")
    
    return index, documents, model

index, documents, model = load_resources()

def search_faiss(query: str, k: int = 3) -> List[str]:
    """Search FAISS for relevant mental health techniques (returns empty list if FAISS not available)."""
    if index is None or model is None or not documents:
        return []
    
    try:
        query_embedding = model.encode([query], convert_to_tensor=False)
        distances, indices = index.search(np.array(query_embedding), k)
        
        results = []
        for idx in indices[0]:
            if idx < len(documents):
                results.append(documents[idx])
        return results[:k]
    except Exception as e:
        print(f"FAISS search error: {e}")
        return []

# ============================================================================
# EMOTION DETECTION (Simple and Clean)
# ============================================================================

def call_hf_inference(text: str, timeout: int = 30):
    """Call the Hugging Face Inference API and return the parsed JSON result."""
    if not HF_TOKEN:
        raise RuntimeError("HF_TOKEN not set")
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": text, "options": {"wait_for_model": True}}
    resp = requests.post(url, headers=headers, json=payload, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def detect_emotions(text: str) -> Dict[str, Any]:
    """Detect emotions using HF Inference API (fallback to neutral).

    Returns the same shape as previous implementation: {sentiment, emotions, confidence}
    """
    if len(text.split()) < 3:
        return {"sentiment": "neutral", "emotions": [], "confidence": 0.0}

    if HF_TOKEN:
        try:
            resp = call_hf_inference(text)
            # resp is usually a list of dicts like [{"label":..., "score":...}]
            if isinstance(resp, dict) and resp.get("error"):
                return {"sentiment": "neutral", "emotions": [], "confidence": 0.0}

            results = resp if isinstance(resp, list) else resp[0] if resp else []
            if not results:
                return {"sentiment": "neutral", "emotions": [], "confidence": 0.0}

            sorted_emotions = sorted(results, key=lambda x: x.get("score", 0), reverse=True)
            top = sorted_emotions[0]
            top_emotion = top.get("label", "")
            top_score = float(top.get("score", 0.0))

            le = top_emotion.lower()
            if any(k in le for k in ["sad", "anger", "fear"]):
                sentiment = "negative"
            elif any(k in le for k in ["joy", "love", "happy"]):
                sentiment = "positive"
            else:
                sentiment = "neutral"

            return {"sentiment": sentiment, "emotions": [top_emotion], "confidence": round(top_score, 2)}
        except Exception as e:
            print("HF inference error:", e)
            return {"sentiment": "neutral", "emotions": [], "confidence": 0.0}

    # No HF_TOKEN configured: return neutral to avoid loading local model on Render
    return {"sentiment": "neutral", "emotions": [], "confidence": 0.0}

# ============================================================================
# LANGUAGE DETECTION
# ============================================================================

def detect_language(text: str) -> str:
    """Detect if user is speaking Urdu/Hinglish or English."""
    # Check for Urdu/Hindi script
    urdu_chars = sum(1 for char in text if '\u0600' <= char <= '\u06FF' or '\u0900' <= char <= '\u097F')
    
    # Check for Hinglish words
    hinglish_words = ['yaar', 'yr', 'hai', 'kya', 'acha', 'theek', 'dekho', 'suno', 'mujhe', 'tumhe']
    has_hinglish = any(word in text.lower() for word in hinglish_words)
    
    if urdu_chars > len(text) * 0.3:
        return "urdu"
    elif has_hinglish or urdu_chars > 0:
        return "hinglish"
    else:
        return "english"

# ============================================================================
# GEMINI API
# ============================================================================

def query_gemini(prompt: str, system_prompt: str, max_tokens: int = 200) -> str:
    """Query Gemini API."""
    if not gemini_model:
        print("Gemini model not available (API key not set)")
        return ""
    
    try:
        full_prompt = f"{system_prompt}\n\n{prompt}"
        
        generation_config = genai.types.GenerationConfig(
            temperature=0.8,
            max_output_tokens=max_tokens,
            top_p=0.9,
        )
        
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
        
        response = gemini_model.generate_content(
            full_prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        if response and response.text:
            return response.text.strip()
        return ""
    except Exception as e:
        print(f"Gemini error: {e}")
        return ""

# ============================================================================
# SIMPLE TEMPLATES (for greetings only)
# ============================================================================

GREETING_TEMPLATES = {
    "english": [
        "Hey there! 👋 How are you doing today?",
        "Hi! 😊 What's on your mind?",
        "Hello! How can I support you today?",
    ],
    "hinglish": [
        "Yaar, kaise ho? 😊 Kya chal raha hai?",
        "Hey! Sab theek? Kya baat hai?",
        "Suno, kaisay ho? Main yahan hoon tumhare liye! 💙",
    ]
}

def is_simple_greeting(text: str) -> bool:
    """Check if it's a simple greeting."""
    greetings = ['hi', 'hello', 'hey', 'kaise ho', 'kaisay ho', 'kessay ho', 'good morning', 'good evening']
    text_lower = text.lower().strip()
    
    # Must be short and contain a greeting word
    if len(text.split()) <= 5:
        return any(greeting in text_lower for greeting in greetings)
    return False

# ============================================================================
# MAIN CHAT ENDPOINT
# ============================================================================

@app.route('/api/chat', methods=['POST'])
def chat():
    """Clean, simple chat endpoint."""
    start_time = time.time()
    
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400
    
    user_message = data['message'].strip()
    conversation_history = data.get('conversation_history', [])
    
    # Detect language
    user_language = detect_language(user_message)
    
    # Detect emotions
    sentiment_analysis = detect_emotions(user_message)
    
    # LEVEL 1: Simple greetings (use templates)
    if is_simple_greeting(user_message):
        import random
        lang_key = "hinglish" if user_language in ["hinglish", "urdu"] else "english"
        response = random.choice(GREETING_TEMPLATES[lang_key])
        
        return jsonify({
            "response": response,
            "sentiment": sentiment_analysis,
            "processing_time": round(time.time() - start_time, 3),
            "response_type": "greeting"
        })
    
    # LEVEL 2: Complex queries (use Gemini + RAG)
    
    # Build conversation context
    conversation_context = ""
    if conversation_history:
        recent_msgs = conversation_history[-4:]
        formatted_history = []
        for msg in recent_msgs:
            role = "User" if msg.get("role") == "user" else "Emma"
            formatted_history.append(f"{role}: {msg.get('content')}")
        conversation_context = "\n".join(formatted_history)
    
    # Get RAG context for mental health queries
    relevant_docs = search_faiss(user_message, k=2)
    context = "\n".join(relevant_docs) if relevant_docs else ""
    
    # Build system prompt based on language
    if user_language == "hinglish":
        system_prompt = """You are Emma, a friendly mental wellness companion.

LANGUAGE: User speaks Roman Urdu/Hinglish. Reply in Roman Urdu/Hinglish.
Use words: yaar, kya, hai, theek, dekho, suno, mujhe, tumhe, etc.

Examples:
- "Yaar, that sounds tough. Kya hua? Tell me more."
- "Theek hai, I understand. Dekho, you're not alone."

Be warm, supportive, and natural. 2-3 sentences max."""
    elif user_language == "urdu":
        system_prompt = """You are Emma, a friendly mental wellness companion.

LANGUAGE: Respond in Urdu script. Be warm and supportive."""
    else:
        system_prompt = """You are Emma, a warm mental wellness companion.
- Be conversational and supportive
- Respond in 2-3 sentences
- Use emojis occasionally 💙
- Ask follow-up questions
- For serious issues, suggest professional help"""
    
    # Build prompt
    prompt = f"""Previous conversation:
{conversation_context}

User: {user_message}

Helpful techniques:
{context}

Respond with empathy and support (2-3 sentences):"""
    
    # Get response from Gemini
    ai_response = query_gemini(prompt, system_prompt, max_tokens=200)
    
    # Fallback if Gemini fails
    if not ai_response:
        if user_language in ["hinglish", "urdu"]:
            ai_response = "Yaar, I'm having trouble right now. Can you say that again? 💙"
        else:
            ai_response = "I'm here to listen. Could you tell me more? 💙"
    
    processing_time = round(time.time() - start_time, 3)
    
    return jsonify({
        "response": ai_response,
        "sentiment": sentiment_analysis,
        "processing_time": processing_time,
        "response_type": "mental_health"
    })

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    try:
        test_response = gemini_model.generate_content("test")
        gemini_status = "online" if test_response else "offline"
    except:
        gemini_status = "offline"
    
    return jsonify({
        "status": "online",
        "gemini_api": gemini_status,
        "model": "gemini-2.0-flash",
        "faiss_docs": len(documents) if documents else 0,
        "faiss_enabled": index is not None,
        "hf_inference_enabled": HF_TOKEN is not None
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint."""
    return jsonify({
        "name": "MIND Helper API (Clean Version)",
        "version": "3.0",
        "status": "online",
        "features": [
            "Emotion detection with pretrained model",
            "Multi-level RAG (templates + Gemini)",
            "Multilingual support (English, Urdu, Hinglish)",
            "Clean, simple codebase"
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
