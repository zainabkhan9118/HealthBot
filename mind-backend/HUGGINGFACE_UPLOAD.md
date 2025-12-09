# Upload Model to Hugging Face - Quick Guide

## Files You Need to Upload

From `./results/xlmr_dair6_e5/checkpoint-18555/`, upload ONLY these 6 files:

✅ **ESSENTIAL FILES (1.13 GB total):**
1. `config.json` - 938 bytes
2. `model.safetensors` - 1.1 GB ⭐ (the actual model)
3. `tokenizer.json` - 17 MB
4. `tokenizer_config.json` - 1.2 KB
5. `special_tokens_map.json` - 280 bytes
6. `sentencepiece.bpe.model` - 4.9 MB

❌ **DON'T UPLOAD (training files - 2.1 GB):**
- `optimizer.pt`, `scheduler.pt`, `scaler.pt`
- `rng_state.pth`, `trainer_state.json`, `training_args.bin`

---

## Option A: Automated Upload (Recommended)

### Step 1: Install Hugging Face CLI
```bash
cd mind-backend
pip install huggingface_hub
```

### Step 2: Login to Hugging Face
```bash
huggingface-cli login
```
Enter your Hugging Face token (get it from: https://huggingface.co/settings/tokens)

### Step 3: Run Upload Script
```bash
python upload_to_huggingface.py
```

This script will:
- Copy only the 6 essential files
- Create a README
- Upload to your Hugging Face account
- Give you the model name to use

---

## Option B: Manual Upload (Web Interface)

### Step 1: Create Repository
1. Go to https://huggingface.co/new
2. Repository name: `emotion-xlmr-dair6`
3. Click "Create model"

### Step 2: Upload Files
1. Click "Files and versions" → "Add file" → "Upload files"
2. Upload ONLY these 6 files:
   - config.json
   - model.safetensors
   - tokenizer.json
   - tokenizer_config.json
   - special_tokens_map.json
   - sentencepiece.bpe.model

### Step 3: Create README.md
Click "Create README.md" and paste:

```markdown
---
license: mit
language: en
tags:
  - emotion-detection
  - text-classification
---

# Emotion Detection Model

Fine-tuned XLM-RoBERTa for emotion detection.

## Usage
\`\`\`python
from transformers import pipeline

classifier = pipeline("text-classification", 
                     model="YOUR_USERNAME/emotion-xlmr-dair6",
                     top_k=None)

results = classifier("I'm feeling anxious")
\`\`\`
```

---

## Step 4: Update Your Code

After uploading, update `app.py`:

```python
# OLD (local path)
MODEL_PATH = "./results/xlmr_dair6_e5/checkpoint-18555"
emotion_classifier = pipeline("text-classification", model=MODEL_PATH, top_k=None)

# NEW (Hugging Face)
MODEL_PATH = "zainabkhan9118/emotion-xlmr-dair6"  # Use your username
emotion_classifier = pipeline("text-classification", model=MODEL_PATH, top_k=None)
```

The model will auto-download on first use on Render!

---

## Quick Summary

**What to upload:** 6 files (1.13 GB total)
**Where:** https://huggingface.co/new
**Result:** A URL like `zainabkhan9118/emotion-xlmr-dair6`
**Usage:** Just change MODEL_PATH in app.py to that URL
