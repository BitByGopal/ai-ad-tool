import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
  const { url, tone, length, audience } = await request.json();

  if (!url) {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

 

  let pageContext = `Website URL: ${url}`;

  // Try to fetch the page content for better ad generation
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3000);
    if (text.length > 100) {
      pageContext = `Website URL: ${url}\n\nPage content:\n${text}`;
    }
  } catch {
    // Continue with just the URL if fetch fails
  }

  const prompt = `You are an expert advertising copywriter. Based on the following website information, generate a compelling ad.

${pageContext}

Ad requirements:
- Tone: ${tone}
- Length: ${length}
- Target audience: ${audience}

Generate a JSON response with exactly these fields:
{
  "headline": "A punchy, attention-grabbing headline (max 10 words)",
  "body": "Compelling ad body copy (2-3 sentences) tailored to the tone and audience"
}

Only respond with the JSON object, no other text.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text ?? "";

  let adData: { headline: string; body: string };
  try {
    adData = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      adData = JSON.parse(match[0]);
    } else {
      return Response.json({ error: "Failed to parse ad content" }, { status: 500 });
    }
  }

  return Response.json(adData);
  } catch (error) {
    console.error("Ad generation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
