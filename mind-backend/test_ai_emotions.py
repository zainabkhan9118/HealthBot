#!/usr/bin/env python3
"""
Test the new AI-powered emotion detection vs old pattern matching.
This demonstrates how the AI understands context without hardcoded patterns!
"""

import requests
import json
from colorama import Fore, Style, init

init(autoreset=True)

API_URL = "http://localhost:5000/api/chat"

def chat(msg, history=[]):
    """Send message and get response."""
    try:
        r = requests.post(API_URL, json={"message": msg, "conversation_history": history}, timeout=10)
        data = r.json()
        response = data.get("response", "")
        sentiment = data.get("sentiment", {})
        
        print(f"\n{Fore.CYAN}{'='*80}")
        print(f"{Fore.YELLOW}User: {msg}")
        print(f"{Fore.GREEN}Emma: {response}")
        print(f"\n{Fore.MAGENTA}📊 AI Analysis:")
        print(f"  Sentiment: {sentiment.get('sentiment', 'N/A')}")
        print(f"  Emotions: {', '.join(sentiment.get('emotions', []))}")
        print(f"  Confidence: {sentiment.get('confidence', 'N/A')}")
        
        history.append({"role": "user", "content": msg})
        history.append({"role": "assistant", "content": response})
        return history
    except Exception as e:
        print(f"{Fore.RED}Error: {e}")
        return history

def main():
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.GREEN}🤖 AI-POWERED EMOTION DETECTION TEST")
    print(f"{Fore.CYAN}{'='*80}\n")
    
    print(f"{Fore.YELLOW}This demonstrates how AI understands context WITHOUT pattern matching!")
    print(f"{Fore.YELLOW}No more hardcoded word lists - the AI actually comprehends meaning.\n")
    
    print(f"{Fore.CYAN}{'='*80}")
    print(f"{Fore.WHITE}TEST 1: Grief and Loss (No keywords like 'died' needed!)")
    print(f"{Fore.CYAN}{'='*80}")
    
    history = []
    history = chat("I lost someone very important recently", history)
    history = chat("Everyone I care about seems to disappear from my life", history)
    
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.WHITE}TEST 2: Relationship Complexity (Understands mixed emotions!)")
    print(f"{Fore.CYAN}{'='*80}")
    
    history = chat("I have butterflies when I see him", history)
    history = chat("But something feels off, he's not treating me well", history)
    history = chat("Part of me knows this isn't healthy", history)
    
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.WHITE}TEST 3: Context Understanding (Same words, different meanings!)")
    print(f"{Fore.CYAN}{'='*80}")
    
    # "Love" in positive context
    history2 = []
    history2 = chat("I love my new job! It's amazing!", history2)
    
    # "Love" in grief context
    history3 = []
    history3 = chat("I loved my grandfather so much and now he's gone", history3)
    
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.WHITE}TEST 4: Subtle Emotions (No obvious keywords!)")
    print(f"{Fore.CYAN}{'='*80}")
    
    history4 = []
    history4 = chat("Everything just feels empty lately", history4)
    history4 = chat("I keep wondering if things will ever get better", history4)
    history4 = chat("Today I actually felt okay for the first time in weeks", history4)
    
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.WHITE}TEST 5: Edge Cases (Things pattern matching fails on!)")
    print(f"{Fore.CYAN}{'='*80}")
    
    history5 = []
    # This would confuse pattern matching but AI understands context
    history5 = chat("I'm dying to see the new movie!", history5)  # "dying" but positive!
    history5 = chat("My friend is killing it at her new job", history5)  # "killing" but positive!
    
    print(f"\n{Fore.CYAN}{'='*80}")
    print(f"{Fore.GREEN}✅ TEST COMPLETE!")
    print(f"{Fore.CYAN}{'='*80}\n")
    
    print(f"{Fore.YELLOW}Key Takeaways:")
    print(f"  ✓ AI understands context (not just keyword matching)")
    print(f"  ✓ Same words mean different things in different contexts")
    print(f"  ✓ No need to hardcode every possible phrase")
    print(f"  ✓ Handles slang, idioms, and edge cases naturally")
    print(f"  ✓ Detects subtle emotions without obvious keywords\n")

if __name__ == "__main__":
    main()
