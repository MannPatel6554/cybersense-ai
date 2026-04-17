from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import json
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

class ThreatRequest(BaseModel):
    content: str
    type: str

@app.post("/analyze")
async def analyze_threat(request: ThreatRequest):
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"""You are a cybersecurity expert. Analyze this {request.type} for threats.

Content: {request.content}

Respond in this exact JSON format only:
{{
  "classification": "PHISHING" or "MALWARE" or "SOCIAL_ENGINEERING" or "SAFE",
  "severity": "HIGH" or "MEDIUM" or "LOW",
  "explanation": "2-3 sentences explaining why in plain English",
  "recommendations": ["action 1", "action 2", "action 3"],
  "indicators": ["indicator 1", "indicator 2"]
}}

Only respond with valid JSON, nothing else."""
            }
        ]
    )
    result = json.loads(message.content[0].text)
    return result

@app.get("/health")
async def health():
    return {"status": "online"}