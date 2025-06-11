from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

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

faiss.write_index(index, "mind_index.faiss")
with open("mind_docs.txt", "w") as f:
    for doc in documents:
        f.write(doc + "\n")
