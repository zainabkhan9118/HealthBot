import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyDuYBF6ssG55Dpz9ViO0simME4zVhtw7ts"
genai.configure(api_key=GEMINI_API_KEY)

print("Available Gemini models:")
for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"  - {model.name}")
