import requests
import json

def test_ollama_connection():
    """Test the connection to the Ollama API"""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            print("✅ Successfully connected to Ollama API")
            models = response.json().get("models", [])
            if models:
                print(f"Available models: {', '.join(model['name'] for model in models)}")
            else:
                print("No models found. Try running 'ollama list' to check available models.")
            return True
        else:
            print(f"❌ Failed to connect to Ollama API: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"❌ Error connecting to Ollama API: {str(e)}")
        print("Make sure Ollama is running. You can start it with 'ollama serve' in a terminal.")
        return False

def test_ollama_generation():
    """Test generating text with Ollama"""
    if not test_ollama_connection():
        return
    
    try:
        headers = {"Content-Type": "application/json"}
        data = {
            "model": "gemma3:1b",
            "prompt": "Hello, how are you today?",
            "stream": False
        }
        
        response = requests.post(
            "http://localhost:11434/api/generate", 
            headers=headers, 
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ Successfully generated text with Ollama")
            print(f"\nPrompt: Hello, how are you today?")
            print(f"Response: {result.get('response', 'No response')}")
        else:
            print(f"❌ Failed to generate text: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error generating text: {str(e)}")

if __name__ == "__main__":
    print("Testing Ollama Integration")
    print("=========================")
    test_ollama_generation()
