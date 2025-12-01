# 📁 Project Structure

```
mind-backend/
├── data/                          # Data files (organized)
│   ├── mind_index.faiss          # FAISS vector index
│   └── mind_docs.txt             # Mental health techniques
│
├── results/                       # Pretrained models
│   └── xlmr_dair6_e5/
│       └── checkpoint-18555/     # Your emotion detection model
│
├── venv/                          # Python virtual environment
│
├── app.py                         # ✨ MAIN APP (clean, 300 lines)
├── build_index.py                 # Build FAISS index
├── test_clean.py                  # Test script
│
├── requirements.txt               # Python dependencies
├── CLEAN_VERSION_SUMMARY.md      # Summary of changes
│
└── app_old_complex.py            # Old version (backup, 900+ lines)
```

---

## 📊 File Organization:

### **Core Files:**
- `app.py` - Main Flask application (clean version)
- `data/` - All data files in one place
- `results/` - Pretrained models

### **Utilities:**
- `build_index.py` - Rebuild FAISS index
- `test_clean.py` - Test the chatbot

### **Backups:**
- `app_old_complex.py` - Old complex version (for reference)

---

## 🎯 Benefits:

1. ✅ **Organized** - Data files in `data/` folder
2. ✅ **Clean** - 300 lines vs 900+ lines
3. ✅ **Maintainable** - Easy to find and update files
4. ✅ **Professional** - Industry-standard structure

---

## 🚀 Quick Start:

```bash
# Run the app
./venv/bin/python app.py

# Test it
./venv/bin/python test_clean.py

# Rebuild FAISS index (if needed)
./venv/bin/python build_index.py
```

---

## ✨ Clean and Professional!
