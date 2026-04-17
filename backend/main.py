from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AdRequest(BaseModel):
    url: str
    tone: str = "Professional"
    length: str = "30 seconds"
    audience: str = "General"

class AdResponse(BaseModel):
    headline: str
    subheadline: str
    body: str
    cta: str
    business_name: str

def scrape_website(url: str):
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        title = soup.find("title")
        title_text = title.get_text(strip=True) if title else ""

        description = soup.find("meta", attrs={"name": "description"})
        desc_text = description["content"] if description and description.get("content") else ""

        paragraphs = soup.find_all("p")
        para_text = " ".join([p.get_text(strip=True) for p in paragraphs[:5]])

        headings = soup.find_all(["h1", "h2", "h3"])
        heading_text = " ".join([h.get_text(strip=True) for h in headings[:5]])

        return {
            "title": title_text,
            "description": desc_text,
            "headings": heading_text,
            "content": para_text,
            "url": url
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not scrape URL: {str(e)}")

@app.get("/")
def root():
    return {"status": "AdForge AI Backend Running!"}

@app.post("/generate-ad", response_model=AdResponse)
def generate_ad(request: AdRequest):

    site_data = scrape_website(request.url)

    prompt = f"""
You are an expert advertising copywriter. Based on this website data, create a compelling ad.

Website URL: {site_data['url']}
Website Title: {site_data['title']}
Description: {site_data['description']}
Headings: {site_data['headings']}
Content: {site_data['content']}

Ad Requirements:
- Tone: {request.tone}
- Length: {request.length}
- Target Audience: {request.audience}

Generate a stream-ready video ad with these exact fields:
BUSINESS_NAME: (extract from website)
HEADLINE: (powerful, attention-grabbing, max 8 words)
SUBHEADLINE: (supporting line, max 10 words)
BODY: (compelling ad copy, 2-3 sentences, conversion focused)
CTA: (call to action button text, max 4 words)

Return ONLY these 5 fields, nothing else. No extra text.
"""

    response = model.generate_content(prompt)
    response_text = response.text.strip()
    lines = response_text.split("\n")

    result = {
        "business_name": "",
        "headline": "",
        "subheadline": "",
        "body": "",
        "cta": ""
    }

    for line in lines:
        line = line.strip()
        if line.startswith("BUSINESS_NAME:"):
            result["business_name"] = line.replace("BUSINESS_NAME:", "").strip()
        elif line.startswith("HEADLINE:"):
            result["headline"] = line.replace("HEADLINE:", "").strip()
        elif line.startswith("SUBHEADLINE:"):
            result["subheadline"] = line.replace("SUBHEADLINE:", "").strip()
        elif line.startswith("BODY:"):
            result["body"] = line.replace("BODY:", "").strip()
        elif line.startswith("CTA:"):
            result["cta"] = line.replace("CTA:", "").strip()

    # Fallback if parsing fails
    if not result["headline"]:
        result["headline"] = "Transform Your Business Today"
    if not result["subheadline"]:
        result["subheadline"] = "Professional Solutions That Work"
    if not result["body"]:
        result["body"] = "We deliver exceptional results for our clients. Contact us today to get started."
    if not result["cta"]:
        result["cta"] = "Get Started Now"
    if not result["business_name"]:
        result["business_name"] = site_data["title"]

    return AdResponse(**result)