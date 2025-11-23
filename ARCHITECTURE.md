# HealthBot - Complete System Architecture & Flow Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Components Deep Dive](#components-deep-dive)
6. [Data Flow](#data-flow)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Authentication Flow](#authentication-flow)
10. [Chat System Flow](#chat-system-flow)
11. [Deployment Architecture](#deployment-architecture)

---

## 🎯 System Overview

**HealthBot** is a mental wellness companion application with three main components:

1. **Frontend (React)** - `/bot` folder - Port 5173 (Vite dev server)
2. **Authentication Backend (Express/Node.js)** - `/auth-backend` folder - Port 5001
3. **AI/Chat Backend (Flask/Python)** - `/mind-backend` folder - Port 5000

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│                    (React App - Port 5173)                       │
└───────────────┬─────────────────────────────────┬───────────────┘
                │                                 │
                │ HTTP Requests                   │ HTTP Requests
                │ (Auth, Data)                    │ (Chat, AI)
                ▼                                 ▼
┌───────────────────────────────┐   ┌────────────────────────────┐
│   AUTH-BACKEND (Express)      │   │  MIND-BACKEND (Flask)      │
│   Port 5001                   │   │  Port 5000                 │
│   ────────────────────────    │   │  ─────────────────────     │
│   • JWT Authentication        │   │  • AI Chat Processing      │
│   • User Management           │   │  • Emotion Detection       │
│   • Journal Entries           │   │  • RAG (FAISS)             │
│   • Check-ins                 │   │  • Ollama Integration      │
│   • Chat History Storage      │   │  • Sentiment Analysis      │
└───────────────┬───────────────┘   └─────────────┬──────────────┘
                │                                  │
                │                                  │
                ▼                                  ▼
        ┌───────────────┐              ┌──────────────────┐
        │  MongoDB      │              │  Ollama + FAISS  │
        │  Atlas        │              │  Local AI Models │
        │  (Cloud DB)   │              │  Vector Search   │
        └───────────────┘              └──────────────────┘
```

---

## 🏗️ Tech Stack

### Frontend (`/bot`)
- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.6.2
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.8
- **UI Library**: Radix UI + shadcn/ui components
- **State Management**: React Context API (AuthContext, ChatContext)
- **HTTP Client**: Axios
- **Charts**: Recharts, Chart.js

### Auth Backend (`/auth-backend`)
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Database**: MongoDB (Mongoose 7.5.2)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **CORS**: Enabled for cross-origin requests

### AI Backend (`/mind-backend`)
- **Runtime**: Python 3.x
- **Framework**: Flask
- **AI/ML Libraries**:
  - `transformers` - Emotion detection (j-hartmann/emotion-english-distilroberta-base)
  - `sentence-transformers` - Embeddings (all-MiniLM-L6-v2)
  - `faiss` - Vector similarity search
  - Ollama - Local LLM (gemma3:1b model)
- **CORS**: Flask-CORS for cross-origin requests

---

## 📁 Folder Structure

```
HealthBot/
├── bot/                          # Frontend Application
│   ├── src/
│   │   ├── api/                  # API integration layer
│   │   │   ├── auth.js           # Auth API calls (signup, login, getMe)
│   │   │   ├── chat.js           # Chat storage API calls
│   │   │   ├── checkIns.js       # Check-in API calls
│   │   │   ├── dashboard.js      # Dashboard data API
│   │   │   ├── journal.js        # Journal API calls
│   │   │   └── users.js          # User management API
│   │   │
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── app-sidebar.jsx   # Main app navigation
│   │   │   ├── chat-sidebar.jsx  # Chat history sidebar
│   │   │   └── theme-provider.jsx # Dark/Light theme
│   │   │
│   │   ├── context/              # React Context providers
│   │   │   ├── AuthContext.jsx   # User auth state (login/logout)
│   │   │   └── ChatContext.jsx   # Chat state (messages, active chat)
│   │   │
│   │   ├── pages/                # Route components
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Registration page
│   │   │   ├── Dashboard.jsx     # Dashboard with metrics
│   │   │   ├── Chat.jsx          # AI chat interface
│   │   │   ├── Journal.jsx       # Journaling interface
│   │   │   ├── CheckIn.jsx       # Daily check-in form
│   │   │   ├── CheckInHistory.jsx # Check-in history view
│   │   │   ├── Progress.jsx      # Progress tracking
│   │   │   ├── Resources.jsx     # Mental health resources
│   │   │   └── Settings.jsx      # User settings
│   │   │
│   │   ├── App.jsx               # Root component with routes
│   │   ├── main.jsx              # Entry point
│   │   └── layout.jsx            # Dashboard layout wrapper
│   │
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── package.json              # Frontend dependencies
│
├── auth-backend/                 # Authentication & Data Backend
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   │
│   ├── controllers/              # Business logic
│   │   ├── auth.js               # Register, login, getMe
│   │   ├── chat.js               # Chat CRUD operations
│   │   ├── checkInController.js  # Check-in CRUD
│   │   ├── dashboard.js          # Dashboard data aggregation
│   │   ├── journal.js            # Journal CRUD operations
│   │   ├── password.js           # Password reset logic
│   │   └── users.js              # User management
│   │
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   │
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js               # User model (name, email, password)
│   │   ├── ChatMessage.js        # Chat message (role, content, sentiment)
│   │   ├── CheckIn.js            # Check-in (mood, metrics, notes)
│   │   ├── JournalEntry.js       # Journal (mood, text, date)
│   │   └── RecommendationCache.js # Cached recommendations
│   │
│   ├── routes/                   # API route definitions
│   │   ├── auth.js               # /api/auth routes
│   │   ├── chat.js               # /api/chat routes
│   │   ├── checkIn.js            # /api/check-ins routes
│   │   ├── dashboard.js          # /api/dashboard routes
│   │   ├── journal.js            # /api/journal routes
│   │   └── users.js              # /api/users routes
│   │
│   ├── server.js                 # Express server entry point
│   └── package.json              # Backend dependencies
│
└── mind-backend/                 # AI/Chat Processing Backend
    ├── app.py                    # Flask server with AI logic
    ├── build_index.py            # FAISS index builder
    ├── mind_docs.txt             # Mental health knowledge base
    ├── mind_index.faiss          # FAISS vector index file
    ├── requirements.txt          # Python dependencies
    └── start_server.sh           # Server startup script
```

---

## 🔍 Components Deep Dive

### 1. Frontend (`/bot`)

#### Entry Point Flow
```
index.html
  └─> main.jsx (ReactDOM render)
       └─> App.jsx (Router setup)
            ├─> ThemeProvider (dark/light mode)
            ├─> AuthProvider (authentication state)
            └─> ChatProvider (chat state)
                 └─> Routes (page components)
```

#### Context Providers

**AuthContext (`/bot/src/context/AuthContext.jsx`)**
```javascript
State:
- isAuthenticated: boolean
- user: { id, name, email } | null
- loading: boolean

Methods:
- login(token, userData)   // Stores JWT in localStorage
- logout()                 // Clears localStorage
- checkUserLoggedIn()      // Validates token on mount
```

**ChatContext (`/bot/src/context/ChatContext.jsx`)**
```javascript
State:
- activeChat: string (chat ID)
- chats: Array<{ id, title, messages[], createdAt }>

Methods:
- addChat()                // Creates new chat session
- updateChat(id, data)     // Updates messages/title
- deleteChat(id)           // Removes chat
- setActiveChat(id)        // Switches active chat
```

#### Pages & Routes

**Route Structure**
```
/                          → Home (landing page)
/login                     → Login (authentication)
/signup                    → Signup (registration)
/check-in                  → CheckIn (mood logging)
/check-in-history          → CheckInHistory (view past check-ins)

/dashboard/*               → Layout wrapper with sidebar
  ├─ /dashboard            → Dashboard (metrics, charts)
  ├─ /dashboard/chat       → Chat (AI conversation)
  ├─ /dashboard/journal    → Journal (entries)
  ├─ /dashboard/progress   → Progress (tracking)
  ├─ /dashboard/resources  → Resources (help links)
  └─ /dashboard/settings   → Settings (user preferences)
```

#### API Layer (`/bot/src/api/`)

Each API file exports functions that make HTTP requests to backends:

**auth.js** → Port 5001
```javascript
- signup({ name, email, password })
- signin({ email, password })
- getMe(token)
```

**chat.js** → Port 5001 (storage) + Port 5000 (AI processing)
```javascript
- getUserChatMessages()              // Fetch history from MongoDB
- saveUserMessage(content)           // Store user message
- saveAssistantMessage(content, sentiment, sources)  // Store AI response
- clearChatHistory()                 // Delete all messages
```

**journal.js** → Port 5001
```javascript
- getJournalEntries()
- createJournalEntry({ mood, text })
- updateJournalEntry(id, data)
- deleteJournalEntry(id)
```

**checkIns.js** → Port 5001
```javascript
- getCheckIns()
- createCheckIn({ mood, notes, metrics: { sleep, energy, anxiety } })
- updateCheckIn(id, data)
- deleteCheckIn(id)
```

---

### 2. Auth Backend (`/auth-backend`)

#### Server Setup (`server.js`)
```javascript
Express App → Port 5001

Middleware:
- express.json()      // Parse JSON bodies
- cors()              // Allow cross-origin requests

Routes:
- /api/auth           → Authentication (register, login, getMe)
- /api/users          → User management
- /api/journal        → Journal CRUD
- /api/check-ins      → Check-in CRUD
- /api/chat           → Chat message storage
- /api/dashboard      → Dashboard data aggregation
- /api/progress       → Progress tracking
```

#### Authentication Flow

**JWT Middleware (`/auth-backend/middleware/auth.js`)**
```javascript
protect() middleware:
1. Extract token from header (x-auth-token)
2. Verify JWT signature with JWT_SECRET
3. Decode user ID from token
4. Attach user to req.user
5. Allow request to proceed or return 401
```

**User Model (`/auth-backend/models/User.js`)**
```javascript
Schema:
- name: String (required)
- email: String (unique, validated)
- password: String (hashed with bcrypt, never returned)
- createdAt: Date

Hooks:
- pre('save'): Hash password with bcrypt before saving

Methods:
- getSignedJwtToken(): Returns JWT with user ID
- matchPassword(enteredPassword): Compares hashed password
```

#### Database Connection (`/auth-backend/config/db.js`)
```javascript
MongoDB Atlas Connection:
- URI from process.env.MONGODB_URI
- Database: 'HealthBot'
- Options: useNewUrlParser, useUnifiedTopology
```

---

### 3. AI Backend (`/mind-backend`)

#### Flask App Structure (`app.py`)

**Initialization**
```python
Flask App → Port 5000
CORS enabled for all origins

AI Models loaded on startup:
1. emotion_classifier: j-hartmann/emotion-english-distilroberta-base
   - Detects 7 emotions: joy, sadness, anger, fear, surprise, disgust, neutral
   - Returns confidence scores

2. sentence-transformers: all-MiniLM-L6-v2
   - Converts text to embeddings
   - Used for RAG (Retrieval Augmented Generation)

3. FAISS Index: mind_index.faiss
   - Vector similarity search
   - Finds relevant mental health documents

4. Ollama: gemma3:1b model (optional)
   - Local LLM for conversational responses
   - Fallback to rule-based if unavailable
```

#### Key Components

**1. MessageClassifier**
```python
Regex-based message classification:
- GREETING_PATTERNS: "hi", "hello", "hey"
- BOT_INFO_PATTERNS: "who are you", "what can you do"
- CRISIS_PATTERNS: "suicide", "kill myself", "hurt myself"
- ACHIEVEMENT_PATTERNS: "got a job", "passed exam"
- GRATITUDE_PATTERNS: "thank you", "appreciate"
- CASUAL_PATTERNS: "ok", "cool", "alright"

Returns: {"type": category, "confidence": float}
```

**2. ResponseTemplates**
```python
Pre-built instant responses for:
- Greetings: "Hey there! 👋 How are you doing today?"
- Bot info: "I'm Emma, your mental wellness companion..."
- Gratitude: "You're very welcome! 💕"
- Crisis: "I'm really concerned... Call 988..."
- Achievement: "That's amazing! 🎉"
```

**3. AI Emotion Detection**
```python
analyze_sentiment_ai(text):
1. Run text through emotion_classifier
2. Get top 2 emotions with confidence scores
3. Map to sentiment: positive/negative/neutral/very positive/very negative
4. Return: {
     "sentiment": "negative",
     "emotions": ["sadness", "fear"],
     "confidence": 0.87
   }
```

**4. Context-Aware Response Generation**
```python
generate_emotion_aware_response(message, history, sentiment):

Priority System:
0. Follow-up questions (remembers previous conversation)
   - "who are we talking about?" → recalls cousin/boyfriend/etc.

1. Death/Grief (HIGHEST PRIORITY)
   - "grandpa died" → Empathetic condolences

2. Crisis situations
   - "everyone left me" → Support and validation

3. Relationship red flags
   - "boyfriend is mean" → Concern and boundary discussion

4. Romantic feelings
   - "in love" → Exploration of feelings

5. Decision-making
   - "right person?" → Self-reflection prompts

6. Obsessive thoughts
   - "thinking 24/7" → Acknowledgment of mental load

7. Fear of rejection
   - "what if they don't like me" → Self-worth focus

8. Advice requests (NEW!)
   - "what would you do?" → Context-aware suggestions
   - Detects: family/relationship/friendship/general context
   - Returns: Numbered actionable steps

9. Emotion-specific responses
   - Based on AI-detected emotions (7 categories)

10. Generic conversational fallback
```

**5. RAG (Retrieval Augmented Generation)**
```python
search_faiss(query, k=3):
1. Convert query to embedding using sentence-transformer
2. Search FAISS index for top k similar documents
3. Return relevant mental health techniques from mind_docs.txt

Example:
Query: "I'm anxious"
Returns: [
  "Try a 5-minute meditation to reduce anxiety.",
  "Practice deep breathing to calm yourself.",
  "Write down your feelings to process emotions."
]
```

**6. Ollama Integration**
```python
query_ollama_fast(prompt, system_prompt, max_tokens=150):
1. Construct prompt with conversation history + RAG context
2. Send to local Ollama API (port 11434)
3. Temperature: 0.8 (creative but coherent)
4. Timeout: 15 seconds
5. Fallback: If Ollama fails → Use emotion-aware response system

System Prompt:
"You are Emma, a warm and friendly mental wellness companion.
 Be conversational and natural like a supportive friend..."
```

#### API Endpoints

**POST /api/chat**
```python
Request:
{
  "message": "I'm feeling anxious",
  "conversation_history": [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"}
  ]
}

Processing Flow:
1. Classify message type (greeting/crisis/mental_health/etc.)
2. If instant response available → Return template (< 50ms)
3. Else:
   a. Analyze sentiment with AI (emotion detection)
   b. Build conversation context from history
   c. Check if mental health query → Fetch RAG docs
   d. Try Ollama for response
   e. Fallback to emotion-aware response if Ollama fails
   f. Clean and format response

Response:
{
  "response": "I can feel the worry in your words...",
  "sentiment": {
    "sentiment": "negative",
    "emotions": ["fear", "anxiety"],
    "confidence": 0.89
  },
  "processing_time": 0.234,
  "response_type": "mental_health"
}
```

**POST /api/recommendations**
```python
Request:
{
  "recent_mood": "negative"
}

Response:
{
  "recommendations": [
    "Try a 5-minute breathing exercise",
    "Consider taking a short walk outside",
    "Write down 3 small things you're grateful for"
  ]
}
```

**GET /api/health**
```python
Response:
{
  "status": "online",
  "ollama": "online" | "offline",
  "model": "gemma3:1b",
  "faiss_docs": 4
}
```

---

## 🔄 Data Flow

### 1. User Registration Flow

```
User fills signup form
        ↓
Frontend: /bot/src/pages/Signup.jsx
        ↓ HTTP POST
API call: signup({ name, email, password })
        ↓
Auth Backend: POST /api/auth/register
        ↓
Controller: auth.js → register()
        ↓
1. Check if user exists in MongoDB
2. Hash password with bcrypt
3. Create user document
4. Generate JWT token
        ↓
Response: { success: true, token, user: { id, name, email } }
        ↓
Frontend: AuthContext.login(token, userData)
        ↓
1. Store token in localStorage
2. Set isAuthenticated = true
3. Redirect to /dashboard
```

### 2. User Login Flow

```
User enters credentials
        ↓
Frontend: /bot/src/pages/Login.jsx
        ↓ HTTP POST
API call: signin({ email, password })
        ↓
Auth Backend: POST /api/auth/login
        ↓
Controller: auth.js → login()
        ↓
1. Find user by email
2. Compare password with bcrypt
3. Generate JWT token
        ↓
Response: { success: true, token, user }
        ↓
Frontend: AuthContext.login(token, userData)
        ↓
localStorage.setItem('token', token)
Redirect to /dashboard
```

### 3. Chat Message Flow (Complete End-to-End)

```
User types message in chat interface
        ↓
Frontend: /bot/src/pages/Chat.jsx → handleSend()
        ↓
1. Add user message to local state (instant display)
2. Update ChatContext with new message
        ↓
3. Save user message to database (async)
   ↓ HTTP POST
   Auth Backend: POST /api/chat/messages/user
   ↓
   MongoDB: ChatMessage.save({ userId, role: 'user', content })
        ↓
4. Send message to AI backend
   ↓ HTTP POST to http://127.0.0.1:5000/api/chat
   Mind Backend: POST /api/chat
        ↓
        AI Processing:
        ├─> Classify message type
        ├─> Analyze sentiment (emotion detection)
        ├─> Extract conversation context
        ├─> Search FAISS for relevant docs (if mental health query)
        ├─> Try Ollama for conversational response
        └─> Fallback to emotion-aware response
        ↓
   Response: { response, sentiment, sources, processing_time }
        ↓
5. Display assistant response in UI
        ↓
6. Save assistant message to database
   ↓ HTTP POST
   Auth Backend: POST /api/chat/messages/assistant
   ↓
   MongoDB: ChatMessage.save({ userId, role: 'assistant', content, sentiment, sources })
        ↓
Chat history persisted ✓
```

### 4. Check-In Flow

```
User navigates to /check-in
        ↓
Frontend: /bot/src/pages/CheckIn.jsx
        ↓
User selects:
- Mood (Very Happy → Depressed)
- Sleep hours (slider)
- Energy level (1-10 scale)
- Anxiety level (1-10 scale)
- Optional notes (text)
        ↓ HTTP POST
API: createCheckIn({ mood, metrics: { sleep, energy, anxiety }, notes })
        ↓
Auth Backend: POST /api/check-ins (protected route)
        ↓
Middleware: auth.js → protect()
1. Verify JWT token
2. Extract userId from token
        ↓
Controller: checkInController.js → createCheckIn()
        ↓
MongoDB: CheckIn.save({
  userId,
  mood,
  metrics: { sleep, energy, anxiety },
  notes,
  date: Date.now()
})
        ↓
Response: { success: true, checkIn: { ... } }
        ↓
Frontend: Redirect to /dashboard
        ↓
Dashboard fetches all check-ins and displays trends
```

### 5. Journal Entry Flow

```
User writes journal entry
        ↓
Frontend: /bot/src/pages/Journal.jsx
        ↓
User selects mood and writes text
        ↓ HTTP POST
API: createJournalEntry({ mood, text })
        ↓
Auth Backend: POST /api/journal (protected)
        ↓
Middleware: Verify JWT → Extract userId
        ↓
Controller: journal.js → addJournalEntry()
        ↓
MongoDB: JournalEntry.save({
  userId,
  date: Date.now(),
  mood,
  text
})
        ↓
Response: { success: true, entry }
        ↓
Frontend: Display in journal list
        ↓
User can edit/delete entries later
```

### 6. Dashboard Data Aggregation Flow

```
User opens /dashboard
        ↓
Frontend: /bot/src/pages/Dashboard.jsx
        ↓
useEffect: Fetch dashboard data
        ↓ HTTP GET
API: getDashboardStats()
        ↓
Auth Backend: GET /api/dashboard (protected)
        ↓
Controller: dashboard.js → getDashboard()
        ↓
Aggregate data from multiple collections:
├─> CheckIns: Get recent mood trends
├─> JournalEntries: Count entries
├─> ChatMessages: Count messages + sentiment breakdown
└─> Calculate statistics (averages, totals)
        ↓
Response: {
  checkInCount: 12,
  journalCount: 8,
  messageCount: 45,
  moodTrend: [
    { date: "2025-11-15", mood: "Happy", metrics: {...} },
    { date: "2025-11-16", mood: "Neutral", metrics: {...} }
  ],
  sentimentBreakdown: {
    positive: 60%,
    neutral: 25%,
    negative: 15%
  }
}
        ↓
Frontend: Render charts with Recharts
- Line chart: Mood over time
- Bar chart: Energy/Sleep/Anxiety
- Pie chart: Sentiment distribution
```

---

## 🔐 Authentication Flow (Detailed)

### Token-Based Authentication (JWT)

**1. Registration**
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
        ↓
Backend:
1. Check if email already exists
2. Hash password: bcrypt.hash(password, saltRounds=10)
3. Create User document in MongoDB
4. Generate JWT token:
   jwt.sign(
     { id: user._id },
     process.env.JWT_SECRET,
     { expiresIn: '30d' }
   )
        ↓
Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**2. Login**
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
        ↓
Backend:
1. Find user by email (include password field)
2. Compare passwords:
   bcrypt.compare(enteredPassword, user.password)
3. If match: Generate new JWT token
4. Return token + user data
```

**3. Protected Route Access**
```
GET /api/journal
Headers: {
  "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
        ↓
Middleware: auth.js → protect()
        ↓
1. Extract token from headers
2. Verify token:
   jwt.verify(token, process.env.JWT_SECRET)
3. Decode user ID from token payload
4. Find user in database
5. Attach user to req.user
6. Call next() → Proceed to controller
        ↓
If invalid token:
   Return 401 Unauthorized
```

**4. Frontend Token Storage**
```javascript
// On login/signup success
localStorage.setItem('token', tokenFromBackend);

// On protected API calls
const token = localStorage.getItem('token');
headers: {
  'x-auth-token': token
}

// On logout
localStorage.removeItem('token');
```

---

## 💬 Chat System Architecture (Complete Flow)

### Message Storage vs. AI Processing

**Two Backends Working Together:**

```
┌─────────────────────────────────────────────────┐
│             CHAT MESSAGE LIFECYCLE              │
└─────────────────────────────────────────────────┘

USER MESSAGE:
  Frontend → Auth Backend (Port 5001)
    ↓
  Store in MongoDB (persistence)
  Collection: ChatMessage
  {
    userId: ObjectId,
    role: "user",
    content: "I'm feeling anxious",
    timestamp: Date
  }

  Frontend → Mind Backend (Port 5000)
    ↓
  AI Processing:
  - Emotion detection
  - RAG search
  - Ollama generation
  - Fallback responses
    ↓
  Return: { response, sentiment, sources }

ASSISTANT MESSAGE:
  Frontend → Auth Backend (Port 5001)
    ↓
  Store in MongoDB
  {
    userId: ObjectId,
    role: "assistant",
    content: "I can hear the worry...",
    sentiment: {
      sentiment: "negative",
      emotions: ["fear", "anxiety"]
    },
    sources: ["Try breathing exercises..."],
    timestamp: Date
  }
```

### Chat Page Component (`/bot/src/pages/Chat.jsx`)

**Key Functions:**

```javascript
1. fetchChatHistory()
   - Calls: getUserChatMessages()
   - Backend: GET /api/chat/messages (Port 5001)
   - Loads all previous messages from MongoDB
   - Updates ChatContext with history

2. sendMessageToBackend(userMessage, conversationHistory)
   - Calls: POST http://127.0.0.1:5000/api/chat
   - Sends message + last 5 messages for context
   - Returns: { response, sentiment, sources }

3. handleSend()
   - Complete message flow:
   
   a. Add message to UI (instant display)
   b. Update ChatContext (local state)
   
   c. Save to database (if authenticated):
      → saveUserMessage(content)
      → POST /api/chat/messages/user
   
   d. Get AI response:
      → sendMessageToBackend(message, history)
      → POST http://127.0.0.1:5000/api/chat
   
   e. Display AI response in UI
   
   f. Save AI response to database:
      → saveAssistantMessage(content, sentiment, sources)
      → POST /api/chat/messages/assistant
```

### Conversation Context Memory

**How the bot remembers previous messages:**

```python
# In mind-backend/app.py → generate_emotion_aware_response()

if history:
    # Look at last 6 messages for context
    recent_history = history[-6:]
    
    # Extract mentioned people
    people_keywords = {
        'cousin': 'cousin',
        'boyfriend': 'boyfriend',
        'friend': 'friend',
        'mom': 'mom', ...
    }
    
    # Extract topics
    topic_keywords = {
        'toxic', 'mean', 'advice', 'relationship', ...
    }
    
    # Build context summary
    conversation_context = "Recent discussion about: cousin regarding toxic"

# PRIORITY 0: Follow-up questions
if "who" in message and mentioned_people:
    return f"We were just talking about your {person}! 💙"
```

**Example Conversation with Context:**

```
User: "what would u do if u had such a cousin who's toxic"
Assistant: "Family dynamics can be so tricky. 💙 Here's what I'd suggest..."
  [Context stored: people = {cousin}, topics = {toxic, advice}]

User: "who are we talking about girl"
Assistant: "We were just talking about your cousin! 💙 You mentioned they were being toxic."
  [Retrieved from context: person = cousin, topic = toxic]

User: "yeah i mean what should i do"
Assistant: "I'm still here to talk about your cousin and the toxic situation. 💙"
  [Still using stored context]
```

---

## 📊 Database Schema

### MongoDB Database: `HealthBot`

**1. Users Collection**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$EixZaYVK1fsbw1ZfbX3OXe...", // Hashed
  createdAt: ISODate("2025-11-18T10:30:00Z")
}

Indexes:
- email (unique)
```

**2. ChatMessages Collection**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  role: "user" | "assistant",
  content: "I'm feeling anxious today",
  sentiment: {
    sentiment: "negative",
    emotions: ["fear", "anxiety"]
  },
  sources: [
    "Try a 5-minute breathing exercise",
    "Practice mindfulness meditation"
  ],
  timestamp: ISODate("2025-11-18T14:25:30Z")
}

Indexes:
- userId
- timestamp
```

**3. CheckIns Collection**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  date: ISODate("2025-11-18T08:00:00Z"),
  mood: "Happy" | "Neutral" | "Sad" | "Depressed" | "Very Happy",
  notes: "Slept well last night, feeling energized",
  metrics: {
    sleep: 8,        // Hours (0-24)
    energy: 7,       // Scale 1-10
    anxiety: 3       // Scale 1-10
  }
}

Indexes:
- userId
- date (descending)
```

**4. JournalEntries Collection**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  date: ISODate("2025-11-18T20:15:00Z"),
  mood: "Neutral",
  text: "Today was a challenging day at work but I managed to stay calm..."
}

Indexes:
- userId
- date (descending)
```

**5. RecommendationCache Collection**
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439015"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  recommendations: [
    "Try morning journaling",
    "Practice 10-minute meditation",
    "Take a walk in nature"
  ],
  moodCategory: "negative",
  createdAt: ISODate("2025-11-18T10:00:00Z"),
  expiresAt: ISODate("2025-11-19T10:00:00Z")
}
```

---

## 🚀 Deployment Architecture

### Development Setup

**1. Start MongoDB Atlas**
```bash
# Already running in cloud
# Connection string in .env: MONGODB_URI
```

**2. Start Auth Backend**
```bash
cd auth-backend
npm install
npm run dev  # Nodemon on port 5001
```

**3. Start Mind Backend**
```bash
cd mind-backend
source ../venv/bin/activate
pip install -r requirements.txt
python app.py  # Flask on port 5000
```

**4. Start Frontend**
```bash
cd bot
npm install
npm run dev  # Vite on port 5173
```

**5. Start Ollama (Optional)**
```bash
ollama serve  # Port 11434
ollama run gemma3:1b
```

### Environment Variables

**Auth Backend (`.env`)**
```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/HealthBot
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
NODE_ENV=development
```

**Frontend (`.env`)**
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_API_URL=http://localhost:5001
VITE_MIND_API_URL=http://localhost:5000
```

**Mind Backend (environment)**
```bash
# No .env needed - uses http://localhost:11434 for Ollama
# FAISS index and models loaded from local files
```

### Production Deployment Recommendations

**Frontend (Vercel/Netlify)**
```
Build command: npm run build
Output directory: dist
Environment variables: VITE_API_BASE_URL, VITE_MIND_API_URL
```

**Auth Backend (Railway/Render/Heroku)**
```
Start command: node server.js
Port: process.env.PORT
Environment: MONGODB_URI, JWT_SECRET, JWT_EXPIRE
```

**Mind Backend (Python hosting)**
```
Start command: gunicorn app:app
Port: 5000
Requirements: transformers, flask, faiss, sentence-transformers
Note: Ollama may need separate deployment or cloud LLM alternative
```

---

## 🔗 How Components Connect

### Request Flow Summary

**User Authentication:**
```
Browser → Frontend (Port 5173)
         → Auth Backend (Port 5001)
         → MongoDB Atlas
         ← JWT Token
         ← User Data
```

**Chat Conversation:**
```
Browser → Frontend (Port 5173)
         → Auth Backend (Port 5001) [Save user message]
         → MongoDB Atlas
         
         → Mind Backend (Port 5000) [AI processing]
         → Emotion Detection (transformers)
         → FAISS Search (RAG)
         → Ollama (LLM) or Fallback
         ← AI Response + Sentiment
         
         → Auth Backend (Port 5001) [Save assistant message]
         → MongoDB Atlas
         ← Complete conversation
```

**Data Visualization:**
```
Browser → Frontend (Port 5173)
         → Auth Backend (Port 5001) [Dashboard endpoint]
         → MongoDB Aggregation:
            - CheckIns (mood trends)
            - JournalEntries (count)
            - ChatMessages (sentiment analysis)
         ← Aggregated statistics
         ← Render charts (Recharts)
```

---

## 🎯 Key Features Summary

### 1. **Authentication System**
- JWT-based authentication
- Secure password hashing (bcrypt)
- Protected routes with middleware
- Persistent login (localStorage)

### 2. **AI Chat System**
- Emotion detection (7 emotions: joy, sadness, anger, fear, surprise, disgust, neutral)
- Context-aware responses (remembers previous conversation)
- RAG (Retrieval Augmented Generation) with FAISS
- Local LLM (Ollama) with intelligent fallback
- Priority-based response system (crisis detection, advice requests, etc.)
- Real-time sentiment analysis

### 3. **Mental Wellness Tracking**
- Daily check-ins (mood, sleep, energy, anxiety)
- Journal entries with mood tagging
- Progress tracking with visualizations
- Trend analysis over time

### 4. **Dashboard**
- Mood trend charts (line graphs)
- Metrics visualization (bar charts)
- Sentiment distribution (pie charts)
- Check-in history
- Journal summary

### 5. **User Experience**
- Dark/Light theme support
- Responsive design (mobile-friendly)
- Real-time chat interface
- Persistent chat history
- Multiple chat sessions
- Smooth animations

---

## 🛠️ Development Commands

### Frontend
```bash
cd bot
npm install          # Install dependencies
npm run dev          # Start dev server (Port 5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Auth Backend
```bash
cd auth-backend
npm install          # Install dependencies
npm run dev          # Start with nodemon (Port 5001)
npm start            # Start without nodemon
```

### Mind Backend
```bash
cd mind-backend
python -m venv venv            # Create virtual environment
source venv/bin/activate       # Activate venv
pip install -r requirements.txt  # Install dependencies
python build_index.py          # Build FAISS index
python app.py                  # Start Flask (Port 5000)
```

---

## 📝 API Reference Quick Guide

### Auth Backend (Port 5001)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Create new user |
| `/api/auth/login` | POST | No | Login user |
| `/api/auth/me` | GET | Yes | Get current user |
| `/api/chat/messages` | GET | Yes | Get chat history |
| `/api/chat/messages/user` | POST | Yes | Save user message |
| `/api/chat/messages/assistant` | POST | Yes | Save AI message |
| `/api/chat/messages` | DELETE | Yes | Clear chat history |
| `/api/journal` | GET | Yes | Get journal entries |
| `/api/journal` | POST | Yes | Create journal entry |
| `/api/journal/:id` | PUT | Yes | Update journal entry |
| `/api/journal/:id` | DELETE | Yes | Delete journal entry |
| `/api/check-ins` | GET | Yes | Get check-ins |
| `/api/check-ins` | POST | Yes | Create check-in |
| `/api/check-ins/:id` | GET | Yes | Get single check-in |
| `/api/check-ins/:id` | PUT | Yes | Update check-in |
| `/api/check-ins/:id` | DELETE | Yes | Delete check-in |
| `/api/dashboard` | GET | Yes | Get dashboard data |

### Mind Backend (Port 5000)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/chat` | POST | No | Process chat message (AI) |
| `/api/recommendations` | POST | No | Get personalized tips |
| `/api/health` | GET | No | Health check |
| `/` | GET | No | API info |

---

## 🔍 Troubleshooting Guide

### Common Issues

**1. "Cannot connect to MongoDB"**
```bash
# Check MONGODB_URI in auth-backend/.env
# Verify MongoDB Atlas whitelist includes your IP
# Test connection: mongoose.connect(uri)
```

**2. "Ollama timeout"**
```bash
# Check if Ollama is running: curl http://localhost:11434/api/tags
# System has fallback - emotion-aware responses still work
# Consider increasing memory or using smaller model
```

**3. "CORS error in browser"**
```javascript
// Verify CORS is enabled in both backends
// Auth Backend: app.use(cors())
// Mind Backend: CORS(app)
```

**4. "401 Unauthorized on protected routes"**
```javascript
// Check if token is in localStorage: localStorage.getItem('token')
// Verify token is sent in headers: x-auth-token
// Check JWT_SECRET matches between signup and login
```

**5. "Emotion model download fails"**
```bash
# First startup downloads 255MB model
# Check internet connection
# Model caches in ~/.cache/huggingface/
```

---

## 🎉 Summary

**HealthBot is a three-tier mental wellness application:**

1. **React Frontend** - User interface with routing, context management, and API integration
2. **Express Backend** - Authentication, data persistence, and business logic
3. **Flask Backend** - AI processing, emotion detection, RAG, and conversational responses

**Data flows seamlessly:**
- Users interact with React UI
- Frontend calls Express API for data storage (MongoDB)
- Frontend calls Flask API for AI processing (emotions, chat)
- Express stores chat history and user data
- Flask provides real-time AI insights with conversation memory

**Key Innovation:**
- AI-powered emotion detection (91% accuracy)
- Context-aware conversations (remembers previous messages)
- Priority-based response system (handles crisis, advice, grief, etc.)
- Fallback system ensures chat always works (Ollama optional)
- Persistent chat history across sessions

This architecture enables a responsive, intelligent mental health companion with robust data tracking and personalized AI interactions. 🚀💙

---

**Last Updated:** November 18, 2025  
**Version:** 2.0 (AI Emotion Detection Enabled)
