from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import re
from typing import List, Dict, Any, Optional
from functools import lru_cache
import time
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Ollama API configuration
OLLAMA_API_BASE = "http://localhost:11434/api"
MODEL_NAME = "gemma3:1b"

# Load emotion detection model (small, fast, accurate)
print("Loading emotion detection model...")
emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)
print("✓ Emotion model loaded!")

# ============================================================================
# PATTERN-BASED CLASSIFIERS (No hardcoded lists!)
# ============================================================================

class MessageClassifier:
    """Intelligent message classification using regex patterns."""
    
    # Greeting patterns - matches variations automatically
    GREETING_PATTERNS = [
        r'\b(hi|hey|hello|sup|yo|hiya|howdy)\b',
        r'\bgood\s+(morning|afternoon|evening|night)\b',
        r'\bwhat\'?s\s+up\b',
        r'\bhow\s+are\s+you\b',
        r'\bhow\'?s\s+it\s+going\b',
    ]
    
    # Bot info patterns
    BOT_INFO_PATTERNS = [
        r'\b(who|what)\s+are\s+you\b',
        r'\btell\s+me\s+about\s+(yourself|you)\b',
        r'\bhow\s+do\s+you\s+work\b',
        r'\bwhat\s+(can|do)\s+you\s+(do|help)\b',
        r'\bwhat\s+is\s+(this|your\s+name)\b',
        r'\b(your|you\'re)\s+name\b',
    ]
    
    # Crisis patterns (immediate response needed)
    CRISIS_PATTERNS = [
        r'\b(suicid(e|al)|kill\s+myself|end\s+(it|my\s+life))\b',
        r'\bhurt\s+(myself|me)\b',
        r'\bdon\'?t\s+want\s+to\s+live\b',
        r'\bbetter\s+off\s+dead\b',
    ]
    
    # Achievement patterns (positive sentiment)
    ACHIEVEMENT_PATTERNS = [
        r'\b(got|landed|achieved|finished|completed|won|passed|succeeded)\s+(a|an|the|my)?\s*(job|offer|promotion|exam|test|project|goal|degree)\b',
        r'\bi\s+(made|did)\s+it\b',
        r'\baccomplished\b',
        r'\bproud\s+of\s+(myself|me)\b',
    ]
    
    # Gratitude patterns
    GRATITUDE_PATTERNS = [
        r'\bthank(s| you)\b',
        r'\bappreciate\b',
        r'\bhelpful\b',
        r'\byou\'?re\s+(great|amazing|awesome|helpful)\b',
    ]
    
    # Casual conversation (doesn't need RAG)
    CASUAL_PATTERNS = [
        r'\bhow\s+was\s+your\s+day\b',
        r'\bwhat\s+do\s+you\s+think\s+about\b',
        r'\b(ok|okay|alright|cool|nice)\b$',  # Single word acknowledgments
    ]
    
    @classmethod
    def classify(cls, message: str) -> Dict[str, Any]:
        """Classify message type and return appropriate category."""
        msg_lower = message.lower().strip()
        
        # Empty or very short messages
        if len(msg_lower) < 2:
            return {"type": "invalid", "confidence": 1.0}
        
        # Check crisis first (highest priority)
        if any(re.search(pattern, msg_lower) for pattern in cls.CRISIS_PATTERNS):
            return {"type": "crisis", "confidence": 1.0}
        
        # Simple greetings (short messages)
        if len(message.split()) <= 5:
            if any(re.search(pattern, msg_lower) for pattern in cls.GREETING_PATTERNS):
                return {"type": "greeting", "confidence": 0.9}
        
        # Bot information requests
        if any(re.search(pattern, msg_lower) for pattern in cls.BOT_INFO_PATTERNS):
            return {"type": "bot_info", "confidence": 0.85}
        
        # Gratitude
        if any(re.search(pattern, msg_lower) for pattern in cls.GRATITUDE_PATTERNS):
            return {"type": "gratitude", "confidence": 0.8}
        
        # Achievements
        if any(re.search(pattern, msg_lower) for pattern in cls.ACHIEVEMENT_PATTERNS):
            return {"type": "achievement", "confidence": 0.8}
        
        # Casual conversation (single word responses)
        if len(message.split()) <= 3:
            if any(re.search(pattern, msg_lower) for pattern in cls.CASUAL_PATTERNS):
                return {"type": "casual", "confidence": 0.7}
        
        # Default to mental health query (needs RAG + AI)
        return {"type": "mental_health", "confidence": 0.5}

# ============================================================================
# INSTANT RESPONSE TEMPLATES (No AI needed!)
# ============================================================================

class ResponseTemplates:
    """Pre-built responses for common interactions - instant delivery."""
    
    GREETINGS = [
        "Hey there! 👋 How are you doing today?",
        "Hi! 😊 What's on your mind?",
        "Hello! How's your day going?",
        "Hey! Good to hear from you. How are you feeling?",
        "Hi there! 🌟 How can I support you today?",
    ]
    
    BOT_INFO = [
        "I'm Emma, your mental wellness companion! 🌸 I'm here to listen, offer support, and share evidence-based wellness techniques. Think of me as a friendly space to talk about what's on your mind. What would you like to chat about?",
        "I'm Emma! 💙 I help with mental wellness through supportive conversation. I can listen to your thoughts, suggest coping strategies, and provide a safe space to express yourself. How are you feeling today?",
    ]
    
    GRATITUDE = [
        "You're very welcome! 💕 I'm here whenever you need to talk.",
        "Happy to help! 😊 Remember, I'm always here for you.",
        "Anytime! That's what I'm here for. 🌟",
        "Glad I could help! Feel free to reach out whenever you need support. 💙",
    ]
    
    CRISIS = [
        "I'm really concerned about what you're sharing. Please reach out to a crisis helpline immediately:\n\n🆘 National Suicide Prevention Lifeline: 988 (call or text)\n🆘 Crisis Text Line: Text HOME to 741741\n\nYou matter, and professional help is available 24/7. Will you reach out to them?",
    ]
    
    ACHIEVEMENT = [
        "That's amazing! 🎉 You should be so proud of yourself! Tell me more about it!",
        "Congratulations! 🌟 That's a huge accomplishment! How does it feel?",
        "Wow, that's fantastic news! 🎊 You worked hard for this. How are you celebrating?",
        "I'm so happy for you! 🥳 You deserve this success!",
    ]
    
    @classmethod
    def get_response(cls, category: str, index: int = 0) -> str:
        """Get a template response by category."""
        templates = {
            "greeting": cls.GREETINGS,
            "bot_info": cls.BOT_INFO,
            "gratitude": cls.GRATITUDE,
            "crisis": cls.CRISIS,
            "achievement": cls.ACHIEVEMENT,
        }
        
        response_list = templates.get(category, [])
        if not response_list:
            return None
        
        # Rotate through responses for variety
        import random
        return random.choice(response_list)

# ============================================================================
# FAISS & RAG SETUP
# ============================================================================

def load_resources():
    """Load FAISS index, documents, and sentence transformer model."""
    if os.path.exists("mind_index.faiss"):
        index = faiss.read_index("mind_index.faiss")
    else:
        raise FileNotFoundError("FAISS index not found. Run build_index.py first.")
    
    if os.path.exists("mind_docs.txt"):
        with open("mind_docs.txt", "r") as f:
            documents = [line.strip() for line in f.readlines()]
    else:
        raise FileNotFoundError("Documents file not found. Run build_index.py first.")
    
    model = SentenceTransformer("all-MiniLM-L6-v2")
    return index, documents, model

index, documents, model = load_resources()

@lru_cache(maxsize=100)
def search_faiss_cached(query: str, k: int = 3) -> tuple:
    """Cached FAISS search for repeated queries."""
    return tuple(search_faiss(query, k))

def search_faiss(query: str, k: int = 3) -> List[str]:
    """Search FAISS index for relevant documents."""
    query_embedding = model.encode([query], convert_to_tensor=False)
    distances, indices = index.search(np.array(query_embedding), k)
    
    results = []
    seen = set()
    for idx in indices[0]:
        if idx < len(documents):
            doc = documents[idx]
            doc_key = doc[:50]
            if doc_key not in seen:
                results.append(doc)
                seen.add(doc_key)
    
    return results[:k]

# ============================================================================
# OPTIMIZED OLLAMA INTERACTION
# ============================================================================

def query_ollama_fast(prompt: str, system_prompt: Optional[str] = None, max_tokens: int = 150) -> str:
    """Optimized Ollama query with shorter responses and faster generation."""
    headers = {"Content-Type": "application/json"}
    data = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.8,  # More creative and conversational
            "num_predict": max_tokens,  # Limit response length
            "top_k": 40,
            "top_p": 0.9,
        }
    }
    
    if system_prompt:
        data["system"] = system_prompt
    
    try:
        response = requests.post(
            f"{OLLAMA_API_BASE}/generate", 
            headers=headers, 
            json=data,
            timeout=15  # 15 second timeout for better responses
        )
        
        if response.status_code == 200:
            result = response.json().get("response", "").strip()
            # Remove common AI artifacts
            result = re.sub(r'^(Sure!|Okay!|Alright!)\s*', '', result, flags=re.IGNORECASE)
            return result
        else:
            print(f"Ollama HTTP error: {response.status_code}")
            return ""
    except requests.exceptions.Timeout:
        print("Ollama timeout - response took too long")
        return ""
    except Exception as e:
        print(f"Ollama error: {e}")
        return ""

def analyze_sentiment_ai(text: str) -> Dict[str, Any]:
    """AI-powered sentiment analysis using transformers - understands context!"""
    # Skip analysis for very short messages
    if len(text.split()) < 3:
        return {"sentiment": "neutral", "emotions": []}
    
    try:
        # Get emotion predictions from AI model
        results = emotion_classifier(text)[0]
        
        # Sort by confidence score
        sorted_emotions = sorted(results, key=lambda x: x['score'], reverse=True)
        
        # Get top 2 emotions
        top_emotions = [e['label'] for e in sorted_emotions[:2]]
        top_scores = [e['score'] for e in sorted_emotions[:2]]
        
        # Map emotions to sentiment categories
        negative_emotions = {'sadness', 'anger', 'fear', 'disgust'}
        positive_emotions = {'joy', 'surprise'}
        neutral_emotions = {'neutral'}
        
        primary_emotion = top_emotions[0]
        primary_score = top_scores[0]
        
        # Determine overall sentiment based on primary emotion
        if primary_emotion in negative_emotions:
            if primary_score > 0.7:
                sentiment = "very negative"
            else:
                sentiment = "negative"
        elif primary_emotion in positive_emotions:
            if primary_score > 0.7:
                sentiment = "very positive"
            else:
                sentiment = "positive"
        else:
            sentiment = "neutral"
        
        return {
            "sentiment": sentiment,
            "emotions": top_emotions,
            "confidence": round(primary_score, 2)
        }
        
    except Exception as e:
        print(f"Emotion AI error: {e}, falling back to simple analysis")
        # Fallback to simple keyword detection
        msg_lower = text.lower()
        
        if any(word in msg_lower for word in ["sad", "depressed", "anxious", "died", "death"]):
            return {"sentiment": "negative", "emotions": ["sadness"], "confidence": 0.5}
        elif any(word in msg_lower for word in ["happy", "great", "love", "excited"]):
            return {"sentiment": "positive", "emotions": ["joy"], "confidence": 0.5}
        else:
            return {"sentiment": "neutral", "emotions": [], "confidence": 0.5}

def generate_emotion_aware_response(message: str, history: List[Dict], sentiment: Dict[str, Any]) -> str:
    """Generate contextual responses based on AI-detected emotions."""
    msg_lower = message.lower()
    detected_emotions = sentiment.get('emotions', [])
    primary_emotion = detected_emotions[0] if detected_emotions else 'neutral'
    
    # Extract context from conversation history
    conversation_context = ""
    mentioned_people = set()
    mentioned_topics = set()
    
    if history:
        # Look at last 6 messages for context
        recent_history = history[-6:]
        for msg in recent_history:
            content = msg.get('content', '').lower()
            
            # Extract mentioned people/relationships
            people_keywords = {
                'cousin': 'cousin', 'boyfriend': 'boyfriend', 'girlfriend': 'girlfriend',
                'friend': 'friend', 'mom': 'mom', 'dad': 'dad', 'parent': 'parent',
                'brother': 'brother', 'sister': 'sister', 'partner': 'partner',
                'husband': 'husband', 'wife': 'wife', 'boss': 'boss', 'coworker': 'coworker'
            }
            
            for keyword, person_type in people_keywords.items():
                if keyword in content:
                    mentioned_people.add(person_type)
            
            # Extract topics
            topic_keywords = {
                'toxic', 'mean', 'advice', 'relationship', 'family', 'work',
                'boundaries', 'help', 'struggle', 'angry', 'sad', 'anxious'
            }
            
            for topic in topic_keywords:
                if topic in content:
                    mentioned_topics.add(topic)
        
        conversation_context = f"Recent discussion about: {', '.join(mentioned_people)} regarding {', '.join(mentioned_topics)}" if mentioned_people else ""
    
    # PRIORITY 0: Follow-up questions referencing previous conversation
    follow_up_patterns = [
        "who", "what", "which", "they", "them", "that person", "this person",
        "we were talking", "you said", "earlier", "before"
    ]
    
    if any(pattern in msg_lower for pattern in follow_up_patterns) and mentioned_people:
        # User is asking about someone from previous conversation
        person = list(mentioned_people)[0]  # Get the most recent person mentioned
        
        if any(word in msg_lower for word in ["who", "which", "what"]):
            return f"We were just talking about your {person}! 💙 You mentioned they were being {'toxic' if 'toxic' in mentioned_topics else 'difficult'}. How are you feeling about the situation now?"
        
        # General follow-up about the topic
        if mentioned_topics:
            topic = list(mentioned_topics)[0]
            return f"I'm still here to talk about your {person} and the {topic} situation. 💙 What else is on your mind about this?"
    
    # PRIORITY 1: Death, grief, loss (HIGHEST PRIORITY - check first!)
    if any(word in msg_lower for word in ["died", "death", "dead", "passed away", "funeral", "grave", "burial", "killed"]):
        grief_words = ["grandpa", "grandma", "grandfather", "grandmother", "parent", "mom", "dad", "mother", "father", 
                       "brother", "sister", "sibling", "friend", "pet", "family"]
        if any(word in msg_lower for word in grief_words):
            return "I'm so deeply sorry for your loss. 💔 Losing someone we love is one of the hardest things we can go through. It's completely normal to feel overwhelmed right now. What would help you most - would you like to talk about your memories of them, or would you prefer some support for coping with grief?"
        else:
            return "I'm so sorry you're dealing with loss. 💔 That's incredibly painful. I'm here to listen if you want to talk about it, or I can suggest some ways to cope with grief. What feels right for you?"
    
    # PRIORITY 2: Crisis situations
    if any(word in msg_lower for word in ["alone", "everyone leave", "everyone i love", "why me", "abandoned"]):
        if any(word in msg_lower for word in ["leave", "left", "gone", "died"]):
            return "Feeling abandoned and alone is such a painful experience. 💙 I want you to know that even though people may leave physically, the love and impact they had on your life stays with you. You're not alone right now - I'm here, and there are people who care. Would it help to talk about these feelings?"
    
    # PRIORITY 3: Relationship concerns with red flags
    if any(word in msg_lower for word in ["mean", "hurt", "rude", "ignore", "cruel", "toxic", "pushing me away"]):
        if any(word in msg_lower for word in ["boy", "girl", "boyfriend", "girlfriend", "partner", "relationship"]):
            return "I'm concerned about what you're sharing. 💙 Being treated meanly or pushed away isn't how healthy relationships work. You deserve someone who treats you with consistent kindness and respect. Can we talk about what red flags you're seeing and how this makes you feel?"
    
    # PRIORITY 4: Romantic feelings (positive)
    if any(word in msg_lower for word in ["in love", "butterflies", "fall for", "crush"]):
        if not any(word in msg_lower for word in ["mean", "hurt", "toxic"]):  # Don't use this if it's problematic
            return "Love and attraction are powerful feelings! 💕 It sounds like you're experiencing something intense. What qualities about this person are drawing you to them? And how do they treat you?"
    
    # PRIORITY 5: Decision-making about relationships
    if "right option" in msg_lower or "right person" in msg_lower or "should i" in msg_lower:
        return "That's a really important question to sit with. 🤔 Sometimes our gut feelings know things before our mind catches up. When you imagine your future, how do you feel when this person is part of it? What does your intuition tell you?"
    
    # PRIORITY 6: Obsessive thoughts
    if "24/7" in msg_lower or "all the time" in msg_lower or "can't stop thinking" in msg_lower:
        return "It sounds like this is really occupying your thoughts. 💭 When something takes up that much mental space, it can be exhausting. What do you think your mind is trying to work through?"
    
    # PRIORITY 7: Fear of rejection/loss
    if any(phrase in msg_lower for phrase in ["what if", "what will happen", "doesn't fall for me", "doesn't like me"]):
        return "Fear of rejection is so real and vulnerable. 💙 But I want you to consider - what about what YOU want? Sometimes we focus so much on whether someone will choose us that we forget to ask if they're the right choice for us. What do you genuinely want from this situation?"
    
    # PRIORITY 8: Asking for advice/suggestions
    if any(phrase in msg_lower for phrase in ["what would you do", "what would u do", "what should i do", "what do i do", "give me advice", "give advice", "any advice", "some advice", "need advice", "suggest", "suggestion", "recommend"]):
        # Check context for specific situations
        if any(word in msg_lower for word in ["cousin", "family", "relative", "sibling", "parent"]):
            return "Family dynamics can be so tricky. 💙 Here's what I'd suggest: 1) Set clear boundaries about what behavior you'll accept, 2) Limit your exposure if they're toxic, 3) Talk to someone neutral (like a counselor) about healthy ways to cope. Remember, you can't change them, but you can protect your peace. What feels doable for you?"
        elif any(word in msg_lower for word in ["friend", "friendship", "toxic friend"]):
            return "Toxic friendships are exhausting. Here's my suggestion: 1) Have an honest conversation about how you feel (if it's safe), 2) Start creating distance gradually, 3) Build connections with people who uplift you. True friends shouldn't make you feel drained. What's your gut telling you to do?"
        elif any(word in msg_lower for word in ["relationship", "boyfriend", "girlfriend", "partner"]):
            return "In a relationship situation, here's what often helps: 1) Trust your instincts - if something feels wrong, it usually is, 2) Talk openly about your needs and boundaries, 3) Don't ignore red flags hoping they'll change. You deserve to feel safe and valued. What's your heart telling you?"
        else:
            # General advice request
            return "I'd love to help you think through this! 💙 Here's my approach: 1) Listen to your gut feeling - what's it telling you? 2) Consider what you'd tell a friend in this situation, 3) Think about what aligns with your values and well-being. What feels most important to you right now?"
    
    # Life/philosophy questions
    if any(phrase in msg_lower for phrase in ["view", "think about", "opinion", "life", "philosophy", "meaning"]):
        return "That's a deep question! 🤔 I think life is about finding meaning in our connections and experiences. What's prompting this reflection for you?"
    
    # Complex feelings
    if any(word in msg_lower for word in ["complex", "conflicted", "confused", "mixed feelings", "don't know"]):
        return "It's totally normal for feelings to be complicated! 💭 Sometimes we can feel multiple things at once - attraction and concern, hope and doubt. What are the different feelings you're noticing?"
    
    # Meeting someone new
    if any(word in msg_lower for word in ["met", "new", "someone"]) and any(word in msg_lower for word in ["boy", "girl", "person", "guy"]):
        return "Meeting someone new can bring up lots of emotions! 😊 What's been on your mind about this person?"
    
    # Questions from user
    if "?" in message:
        if sentiment.get("sentiment") == "negative":
            return "That's an important question to explore. 💙 I'm here to help you think through it. What's been weighing on you about this?"
        else:
            return "Great question! 🌟 What are your own thoughts on this? Sometimes talking it through helps us discover what we already know inside."
    
    # Negative sentiment - offer support
    if sentiment.get("sentiment") == "negative":
        negative_words = ["sad", "anxious", "depressed", "worried", "scared", "angry", "upset"]
        detected_emotion = next((word for word in negative_words if word in msg_lower), "difficulty")
        return f"I can hear the {detected_emotion} in what you're sharing. 💙 These feelings are valid. Would you like to talk more about what's contributing to how you're feeling, or would some coping strategies be helpful right now?"
    
    # Positive sentiment - celebrate
    if sentiment.get("sentiment") == "positive":
        return "I love your positive energy! ✨ It's wonderful to hear you sounding good. What's bringing you joy right now?"
    
    # EMOTION-SPECIFIC RESPONSES (based on AI detection)
    emotion_responses = {
        'sadness': [
            "I can hear the sadness in what you're sharing. 💙 It's okay to feel this way. What's weighing heaviest on your heart right now?",
            "That sounds really painful. 😔 Sometimes sadness needs space to be felt. Would you like to talk about what's making you feel this way?",
        ],
        'anger': [
            "I sense some frustration and anger in what you're saying. 💙 Those are valid feelings. What's at the root of this anger?",
            "It sounds like something has really upset you. 😤 Anger often comes from feeling hurt or unheard. What triggered this?",
        ],
        'fear': [
            "I can feel the worry and fear in your words. 💙 It's scary when we're uncertain. What are you most afraid of right now?",
            "Anxiety and fear can be overwhelming. 😟 You're not alone in this. What's making you feel unsafe or worried?",
        ],
        'joy': [
            "I love hearing this positive energy from you! ✨ What's bringing you this happiness?",
            "Your joy is wonderful! 😊 It's great to celebrate good moments. What's going well?",
        ],
        'surprise': [
            "That sounds unexpected! 😮 How are you processing this surprise?",
            "Wow, that must have caught you off guard! Tell me more about what happened.",
        ],
        'disgust': [
            "It sounds like something really bothered you. What happened that made you feel this way?",
            "I can hear your strong reaction to this. 💙 What about this situation is most troubling?",
        ],
    }
    
    # Use emotion-specific response if we detected one
    if primary_emotion in emotion_responses:
        import random
        return random.choice(emotion_responses[primary_emotion])
    
    # Generic but varied fallback
    conversational_responses = [
        "Tell me more about what you're experiencing. I'm here to listen. 💙",
        "I'm hearing you. What else is on your mind about this? 💭",
        "That's a lot to process. How are you feeling about all of this? 🌟",
        "I want to understand better. Can you share more about what this means to you? 💙",
    ]
    
    import random
    return random.choice(conversational_responses)

# ============================================================================
# CHAT ENDPOINT WITH OPTIMIZED ROUTING
# ============================================================================

@app.route('/api/chat', methods=['POST'])
def chat():
    """Optimized chat endpoint with instant responses for common queries."""
    start_time = time.time()
    
    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400
    
    user_message = data['message'].strip()
    conversation_history = data.get('conversation_history', [])
    
    # Classify the message
    classification = MessageClassifier.classify(user_message)
    msg_type = classification["type"]
    
    # Handle invalid/empty messages
    if msg_type == "invalid":
        return jsonify({
            "response": "I didn't quite catch that. Could you tell me more?",
            "sentiment": {"sentiment": "neutral", "emotions": []},
            "processing_time": round(time.time() - start_time, 3)
        })
    
    # INSTANT RESPONSES (No AI needed!)
    if msg_type in ["greeting", "bot_info", "gratitude", "crisis", "achievement"]:
        template_response = ResponseTemplates.get_response(msg_type)
        
        return jsonify({
            "response": template_response,
            "sentiment": analyze_sentiment_ai(user_message),
            "processing_time": round(time.time() - start_time, 3),
            "response_type": msg_type  # For debugging
        })
    
    # CASUAL CONVERSATION (Quick AI response, no RAG)
    if msg_type == "casual":
        system_prompt = "You are Emma, a friendly companion. Respond in 1-2 sentences, casually and warmly."
        prompt = f"User said: '{user_message}'\n\nRespond naturally and briefly:"
        
        ai_response = query_ollama_fast(prompt, system_prompt, max_tokens=100)
        
        return jsonify({
            "response": ai_response or "I'm here with you. What's on your mind?",
            "sentiment": analyze_sentiment_ai(user_message),
            "processing_time": round(time.time() - start_time, 3),
            "response_type": "casual"
        })
    
    # MENTAL HEALTH QUERY / GENERAL CONVERSATION
    # Get sentiment
    sentiment_analysis = analyze_sentiment_ai(user_message)
    
    # Build conversation context first
    conversation_context = ""
    if conversation_history:
        recent_msgs = conversation_history[-4:]  # Last 4 messages for better context
        formatted_history = []
        for msg in recent_msgs:
            role = "User" if msg.get("role") == "user" else "Emma"
            formatted_history.append(f"{role}: {msg.get('content')}")
        conversation_context = "\n".join(formatted_history)
    
    # Check if this is a mental health query or general conversation
    mental_health_keywords = [
        "anxious", "anxiety", "depressed", "depression", "stressed", "stress",
        "panic", "worried", "fear", "scared", "sad", "lonely", "overwhelmed",
        "can't sleep", "insomnia", "therapy", "therapist", "help me"
    ]
    
    is_mental_health = any(keyword in user_message.lower() for keyword in mental_health_keywords)
    
    # System prompt - friendly conversational companion
    system_prompt = """You are Emma, a warm and friendly mental wellness companion.
    - Be conversational and natural like a supportive friend
    - Respond in 2-3 sentences, keep it light and engaging
    - Use emojis occasionally to add warmth
    - Ask follow-up questions to keep the conversation going
    - Be curious about their experiences
    - For serious mental health issues, gently suggest professional help
    - Never be clinical or robotic - be human and relatable"""
    
    # Build the prompt based on message type
    if is_mental_health:
        # Get relevant mental health context from FAISS
        relevant_docs = search_faiss(user_message, k=2)
        context = "\n".join(relevant_docs) if relevant_docs else ""
        
        prompt = f"""Previous conversation:
{conversation_context}

User: {user_message}

Helpful mental health techniques:
{context}

Respond with empathy and support. If appropriate, suggest a technique from above. Keep it conversational (2-3 sentences):"""
    else:
        # General conversation - be a friendly companion
        prompt = f"""Previous conversation:
{conversation_context}

User: {user_message}

Respond naturally as a warm, supportive friend. Be conversational and engaging. Show interest in what they're sharing. Keep it to 2-3 sentences and ask a follow-up question if appropriate:"""
    
    # Try Ollama first
    ai_response = query_ollama_fast(prompt, system_prompt, max_tokens=200)
    
    # Smart fallback if AI fails (Ollama down or out of memory)
    if not ai_response:
        ai_response = generate_emotion_aware_response(user_message, conversation_history, sentiment_analysis)
    
    # Clean response
    ai_response = ai_response.strip()
    ai_response = re.sub(r'^(Emma:|Assistant:|AI:|User:)\s*', '', ai_response, flags=re.IGNORECASE)
    
    processing_time = round(time.time() - start_time, 3)
    
    return jsonify({
        "response": ai_response,
        "sentiment": sentiment_analysis,
        "processing_time": processing_time,
        "response_type": "mental_health"
    })

# ============================================================================
# RECOMMENDATIONS ENDPOINT
# ============================================================================

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Generate personalized recommendations based on recent mood."""
    data = request.json
    recent_mood = data.get('recent_mood', 'neutral')
    
    # Quick template-based recommendations
    recommendations = {
        "positive": [
            "Keep up the great energy! Try journaling about what's going well.",
            "You're doing amazing! Consider sharing your positivity with a friend.",
            "Maintain this momentum with a gratitude practice each morning."
        ],
        "negative": [
            "Try a 5-minute breathing exercise to calm your mind.",
            "Consider taking a short walk outside - movement can shift your mood.",
            "Write down 3 small things you're grateful for today."
        ],
        "neutral": [
            "Start your day with a simple mindfulness practice.",
            "Check in with yourself regularly - set hourly reminders.",
            "Try a new activity this week to bring variety to your routine."
        ]
    }
    
    mood_category = "neutral"
    if "positive" in recent_mood.lower():
        mood_category = "positive"
    elif "negative" in recent_mood.lower():
        mood_category = "negative"
    
    return jsonify({
        "recommendations": recommendations[mood_category]
    })

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint."""
    # Quick Ollama check
    try:
        response = requests.get(f"{OLLAMA_API_BASE.replace('/api', '')}/api/tags", timeout=2)
        ollama_status = "online" if response.status_code == 200 else "offline"
    except:
        ollama_status = "offline"
    
    return jsonify({
        "status": "online",
        "ollama": ollama_status,
        "model": MODEL_NAME,
        "faiss_docs": len(documents)
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint."""
    return jsonify({
        "name": "MIND Helper API (Optimized)",
        "version": "2.0",
        "status": "online",
        "features": [
            "Instant responses for common queries",
            "Pattern-based message classification",
            "Optimized AI generation",
            "Response time < 1s for templates"
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
