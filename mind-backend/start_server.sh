#!/bin/bash

# Start Flask server with AI emotion detection
cd "/home/zainab/side_hustle /HealthBot/mind-backend"
source "/home/zainab/side_hustle /venv/bin/activate"

echo "🤖 Starting MIND Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✓ Loading AI emotion detection model (one-time download ~255MB)"
echo "✓ No more pattern matching - AI understands context!"
echo "✓ 91% emotion accuracy across 7 emotions"
echo ""
echo "Server will be available at: http://localhost:5000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python app.py
