"""
Upload your custom emotion detection model to Hugging Face Hub

Instructions:
1. Install huggingface_hub: pip install huggingface_hub
2. Login to Hugging Face: huggingface-cli login
3. Run this script: python upload_to_huggingface.py
"""

from huggingface_hub import HfApi, create_repo
import os
import shutil
from pathlib import Path

# Configuration
MODEL_PATH = "./results/xlmr_dair6_e5/checkpoint-18555"
REPO_NAME = "zainabkhan9118/emotion-xlmr-dair6"  # Change to your username
TEMP_DIR = "./temp_upload"

# Files needed for inference (NOT training files)
REQUIRED_FILES = [
    "config.json",
    "model.safetensors",
    "tokenizer.json",
    "tokenizer_config.json",
    "special_tokens_map.json",
    "sentencepiece.bpe.model"
]

def prepare_model_for_upload():
    """Copy only necessary files to temp directory."""
    print("📁 Preparing model files for upload...")
    
    # Create temp directory
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR)
    
    # Copy only required files
    for filename in REQUIRED_FILES:
        src = os.path.join(MODEL_PATH, filename)
        dst = os.path.join(TEMP_DIR, filename)
        
        if os.path.exists(src):
            shutil.copy2(src, dst)
            file_size = os.path.getsize(src) / (1024 * 1024)  # MB
            print(f"  ✓ Copied {filename} ({file_size:.1f} MB)")
        else:
            print(f"  ⚠️ Warning: {filename} not found")
    
    # Create a README
    readme_content = """---
license: mit
language:
- en
tags:
- emotion-detection
- text-classification
- xlm-roberta
- mental-health
---

# Emotion Detection Model (XLM-RoBERTa)

Fine-tuned XLM-RoBERTa model for emotion detection in mental health contexts.

## Usage

```python
from transformers import pipeline

# Load the model
emotion_classifier = pipeline(
    "text-classification",
    model="zainabkhan9118/emotion-xlmr-dair6",
    top_k=None
)

# Detect emotions
text = "I'm feeling really anxious about tomorrow"
results = emotion_classifier(text)
print(results)
```

## Model Details

- Base Model: XLM-RoBERTa
- Task: Multi-class emotion classification
- Training Dataset: DAIR emotion dataset (E5)
- Use Case: Mental health chatbot emotion detection

## Labels

The model detects emotions such as:
- joy, sadness, anger, fear, surprise, disgust, etc.

## Citation

If you use this model, please cite appropriately.
"""
    
    with open(os.path.join(TEMP_DIR, "README.md"), "w") as f:
        f.write(readme_content)
    print("  ✓ Created README.md")
    
    print(f"\n✅ Model prepared in {TEMP_DIR}/")
    total_size = sum(
        os.path.getsize(os.path.join(TEMP_DIR, f)) 
        for f in os.listdir(TEMP_DIR)
    ) / (1024 * 1024 * 1024)  # GB
    print(f"📊 Total size: {total_size:.2f} GB")

def upload_to_hub():
    """Upload model to Hugging Face Hub."""
    print(f"\n🚀 Uploading to Hugging Face: {REPO_NAME}")
    
    try:
        # Initialize API
        api = HfApi()
        
        # Create repository (if it doesn't exist)
        print("Creating repository...")
        try:
            create_repo(
                repo_id=REPO_NAME,
                repo_type="model",
                exist_ok=True
            )
            print("  ✓ Repository created/verified")
        except Exception as e:
            print(f"  ℹ️ Repository might already exist: {e}")
        
        # Upload all files
        print("\n📤 Uploading files (this may take a while)...")
        api.upload_folder(
            folder_path=TEMP_DIR,
            repo_id=REPO_NAME,
            repo_type="model",
        )
        
        print(f"\n✅ SUCCESS! Model uploaded to: https://huggingface.co/{REPO_NAME}")
        print(f"\n📝 To use in your app, update app.py:")
        print(f'   MODEL_PATH = "{REPO_NAME}"')
        
    except Exception as e:
        print(f"\n❌ Upload failed: {e}")
        print("\n💡 Make sure you're logged in: huggingface-cli login")
        return False
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("🤗 Hugging Face Model Upload Tool")
    print("=" * 60)
    
    # Step 1: Prepare files
    prepare_model_for_upload()
    
    # Step 2: Confirm upload
    print("\n" + "=" * 60)
    response = input("📤 Ready to upload? This will upload ~1.1 GB. (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        success = upload_to_hub()
        
        if success:
            # Clean up temp directory
            response = input("\n🗑️ Delete temp directory? (yes/no): ")
            if response.lower() in ['yes', 'y']:
                shutil.rmtree(TEMP_DIR)
                print("  ✓ Temp directory deleted")
    else:
        print("\n⏸️ Upload cancelled. Temp files remain in:", TEMP_DIR)
        print("   You can manually upload them to Hugging Face.")
