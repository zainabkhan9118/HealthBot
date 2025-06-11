from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
retriever = SentenceTransformer("all-MiniLM-L6-v2")
generator = pipeline("text2text-generation", model="google/flan-t5-base")
index = faiss.read_index("mind_index.faiss")
docs = open("mind_docs.txt").read().splitlines()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str

@app.post("/chat")
def chat(input: ChatInput):
    embedding = retriever.encode([input.message])[0]
    _, I = index.search(np.array([embedding]), k=2)
    context = " ".join([docs[i] for i in I[0]])
    prompt = (
        "Provide an empathetic, supportive response to the following user message, using the helpful tips as context.\n"
        f"User message: {input.message}\n"
        f"Helpful tips: {context}"
    )
    response = generator(prompt, max_length=100)[0]["generated_text"]
    reply = response.strip()
    return {"reply": reply}
