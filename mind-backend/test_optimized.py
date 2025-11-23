#!/usr/bin/env python3
"""Test script to demonstrate the optimized chat API performance."""

import requests
import json
import time
from colorama import Fore, Style, init

init(autoreset=True)

API_URL = "http://localhost:5000/api/chat"

def test_message(message, description):
    """Send a test message and measure response time."""
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.YELLOW}Test: {description}")
    print(f"{Fore.WHITE}User: {message}")
    
    start_time = time.time()
    
    try:
        response = requests.post(
            API_URL,
            json={"message": message},
            timeout=15
        )
        
        elapsed = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            bot_response = data.get("response", "")
            processing_time = data.get("processing_time", 0)
            response_type = data.get("response_type", "unknown")
            sentiment = data.get("sentiment", {})
            
            print(f"{Fore.GREEN}Emma: {bot_response}")
            print(f"\n{Fore.MAGENTA}📊 Metrics:")
            print(f"  ⏱️  Total Time: {elapsed:.3f}s")
            print(f"  🔧 Processing Time: {processing_time}s")
            print(f"  🏷️  Response Type: {response_type}")
            print(f"  😊 Sentiment: {sentiment.get('sentiment', 'N/A')}")
            
            # Performance indicator
            if elapsed < 0.5:
                print(f"  {Fore.GREEN}⚡ INSTANT! (< 0.5s)")
            elif elapsed < 2:
                print(f"  {Fore.YELLOW}✓ Fast (< 2s)")
            else:
                print(f"  {Fore.RED}⚠️  Slow (> 2s)")
                
        else:
            print(f"{Fore.RED}Error {response.status_code}: {response.text}")
            
    except requests.exceptions.Timeout:
        elapsed = time.time() - start_time
        print(f"{Fore.RED}⚠️  Request timed out after {elapsed:.2f}s")
    except Exception as e:
        print(f"{Fore.RED}Error: {str(e)}")

def main():
    """Run comprehensive test suite."""
    print(f"{Fore.CYAN}{'='*60}")
    print(f"{Fore.GREEN}🚀 OPTIMIZED CHAT API PERFORMANCE TEST")
    print(f"{Fore.CYAN}{'='*60}\n")
    
    print(f"{Fore.YELLOW}Testing different message types to demonstrate optimization:")
    
    # Test instant responses (should be < 0.1s)
    test_message("hi", "Simple greeting - SHOULD BE INSTANT")
    test_message("hello there", "Greeting variation")
    test_message("good morning", "Time-based greeting")
    
    test_message("who are you", "Bot info - SHOULD BE INSTANT")
    test_message("what can you do", "Bot capabilities")
    
    test_message("thanks", "Gratitude - SHOULD BE INSTANT")
    test_message("thank you so much", "Gratitude variation")
    
    test_message("I got a job!", "Achievement - SHOULD BE INSTANT")
    test_message("i landed an internship", "Achievement variation")
    
    # Test crisis response (instant template)
    test_message("i want to hurt myself", "Crisis - SHOULD BE INSTANT")
    
    # Test casual conversation (quick AI, no RAG)
    test_message("ok", "Casual acknowledgment - QUICK AI")
    test_message("nice", "Short casual response")
    
    # Test mental health queries (full RAG + AI)
    test_message("I'm feeling really anxious about my exams", "Mental health query - FULL RAG")
    test_message("I can't sleep and I'm stressed", "Complex mental health issue")
    
    # Edge cases
    test_message("", "Empty message")
    test_message("a", "Single character")
    test_message("hmm", "Very short message")
    test_message("What do you think about climate change?", "Off-topic question")
    
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.GREEN}✅ Test suite complete!")
    print(f"{Fore.CYAN}{'='*60}\n")
    
    print(f"{Fore.YELLOW}Key Performance Indicators:")
    print(f"  ✅ Instant responses (< 0.5s): Greetings, bot info, gratitude, achievements, crisis")
    print(f"  ⚡ Quick responses (< 2s): Casual conversation")
    print(f"  🔍 Full processing (< 5s): Mental health queries with RAG")

if __name__ == "__main__":
    main()
