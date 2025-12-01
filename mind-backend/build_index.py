from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os

# Create data directory if it doesn't exist
os.makedirs("data", exist_ok=True)

documents = [
    "Practice deep breathing to calm yourself.",
    "Try a 5-minute meditation to reduce anxiety.",
    "Write down your feelings to process your emotions.",
    "Talk to a friend or therapist if you're overwhelmed."
]

model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(documents, convert_to_tensor=False)
index = faiss.IndexFlatL2(len(embeddings[0]))
index.add(np.array(embeddings))

faiss.write_index(index, "data/mind_index.faiss")
with open("data/mind_docs.txt", "w") as f:
    for doc in documents:
        f.write(doc + "\n")

print("✓ FAISS index and documents saved to data/ folder")

