from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

app = FastAPI()
retriever = SentenceTransformer("all-MiniLM-L6-v2")
generator = pipeline("text-generation", model="gpt2")
index = faiss.read_index("mind_index.faiss")
docs = open("mind_docs.txt").read().splitlines()

class ChatInput(BaseModel):
    message: str

@app.post("/chat")
def chat(input: ChatInput):
    embedding = retriever.encode([input.message])[0]
    _, I = index.search(np.array([embedding]), k=2)
    context = " ".join([docs[i] for i in I[0]])
    prompt = f"User: {input.message}\nHelpful tip: {context}\nBot:"
    response = generator(prompt, max_length=100, do_sample=True, top_k=50)[0]["generated_text"]
    reply = response.split("Bot:")[-1].strip()
    return {"reply": reply}
