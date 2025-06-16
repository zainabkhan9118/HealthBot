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

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Analyze the sentiment of the user's message using Ollama."""
    prompt = f"""Analyze the sentiment in this text and categorize it as one of: 
    'very negative', 'negative', 'neutral', 'positive', or 'very positive'.
    Also extract any emotions expressed (like sadness, anxiety, joy, etc.).
    Format the response as JSON with keys 'sentiment' and 'emotions'.
    
    Text to analyze: "{text}"
    """
    
    system_prompt = "You are a helpful sentiment analysis assistant. Only respond with the JSON object."
    
    response = query_ollama(prompt, system_prompt)
    result_text = response.get("response", "")
    
    # Try to extract JSON from the response
    try:
        # Find JSON pattern in the response
        json_match = re.search(r'{[\s\S]*}', result_text)
        if json_match:
            json_str = json_match.group(0)
            sentiment_data = json.loads(json_str)
            return sentiment_data
        else:
            # Fallback parsing
            lines = result_text.split('\n')
            sentiment = ""
            emotions = []
            
            for line in lines:
                if "sentiment" in line.lower():
                    sentiment = line.split(':')[-1].strip().strip('"\'.,')
                if "emotions" in line.lower():
                    emotions_text = line.split(':')[-1].strip().strip('"\'.,[]')
                    emotions = [e.strip().strip('"\'.,') for e in emotions_text.split(',')]
            
            return {
                "sentiment": sentiment,
                "emotions": emotions
            }
    except Exception as e:
        return {
            "sentiment": "unknown",
            "emotions": [],
            "error": str(e)
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
    
    # Analyze sentiment
    sentiment_analysis = analyze_sentiment(user_message)
    
    # Get relevant documents based on the user's message
    relevant_docs = search_faiss(user_message)
    
    # Create a context from relevant documents
    context = "\n".join(relevant_docs)
    
    # Create a prompt with the context
    system_prompt = """You are an empathetic AI mental health assistant called Mind Helper. 
    Your goal is to provide supportive, understanding responses. 
    Never claim to be a doctor or therapist, but offer evidence-based techniques.
    If the user expresses serious issues like suicidal thoughts, encourage them to seek professional help immediately.
    Keep your responses compassionate, non-judgmental, and helpful."""
    
    # Determine the appropriate prompt based on sentiment
    if 'negative' in sentiment_analysis.get('sentiment', '').lower():
        prompt = f"""The user seems to be expressing negative emotions. They said: "{user_message}"
        
        Based on this context and their message, provide a compassionate, helpful response:
        {context}
        
        First acknowledge their feelings, then offer 1-2 specific suggestions from the context that might help them."""
    else:
        prompt = f"""The user said: "{user_message}"
        
        Based on this context and their message, provide a supportive response:
        {context}"""
    
    # Query Ollama
    response = query_ollama(prompt, system_prompt)
    
    # Prepare the response
    result = {
        "response": response.get("response", "I'm sorry, I couldn't process your request."),
        "sentiment": sentiment_analysis,
        "sources": relevant_docs
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