"use client";
import { useState } from "react";

const tones = ["Professional", "Casual", "Energetic", "Luxury", "Friendly"];
const lengths = ["15 seconds", "30 seconds", "60 seconds"];
const audiences = ["General", "Young Adults (18-25)", "Professionals", "Parents", "Seniors"];

const sampleAds = [
  {
    headline: "Trusted Legal Excellence Since Day One",
    subheadline: "Your Rights. Our Mission.",
    body: "When it matters most, you need a law firm that fights for you. With years of proven expertise and hundreds of successful cases, we deliver results — not excuses.",
    cta: "Get Free Consultation",
    score: 87,
    color: "#1a1a2e",
    accent: "#e94560",
  },
  {
    headline: "Justice Starts With One Call",
    subheadline: "Expert Legal Help, Available Now.",
    body: "Don't face legal challenges alone. Our experienced attorneys are ready 24/7 to protect your interests and fight for the outcome you deserve.",
    cta: "Speak to a Lawyer Today",
    score: 92,
    color: "#0f3460",
    accent: "#f5a623",
  },
  {
    headline: "Your Case Deserves the Best",
    subheadline: "Asafi Law Firm — Results That Speak.",
    body: "From personal injury to business disputes, we bring unmatched dedication to every case. Real lawyers. Real results. Real justice.",
    cta: "Book Your Free Case Review",
    score: 79,
    color: "#16213e",
    accent: "#0f9b58",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  const [activeAd, setActiveAd] = useState(0);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("30 seconds");
  const [audience, setAudience] = useState("General");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    if (!url) return;
    setStep("loading");
    setProgress(0);
    const steps = [15, 35, 55, 75, 90, 100];
    steps.forEach((p, i) => {
      setTimeout(() => {
        setProgress(p);
        if (p === 100) {
          setTimeout(() => {
            const ad = sampleAds[0];
            setHeadline(ad.headline);
            setBody(ad.body);
            setStep("result");
          }, 400);
        }
      }, i * 600);
    });
  };

  const handleRegenerate = () => {
    const next = (activeAd + 1) % sampleAds.length;
    setActiveAd(next);
    setHeadline(sampleAds[next].headline);
    setBody(sampleAds[next].body);
  };

  const currentAd = sampleAds[activeAd];
  const displayHeadline = editMode ? headline : currentAd.headline;
  const displayBody = editMode ? body : currentAd.body;

  return (
    <main style={{ minHeight: "100vh", background: "#050510", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #ffffff15", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #e94560, #f5a623)", borderRadius: 8 }} />
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.5px" }}>AdForge <span style={{ color: "#e94560" }}>AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ background: "#ffffff10", border: "1px solid #ffffff20", padding: "6px 14px", borderRadius: 20, fontSize: 13, color: "#aaa" }}>Prototype v0.1</span>
        </div>
      </header>

      {/* INPUT STEP */}
      {step === "input" && (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#e9456015", border: "1px solid #e9456030", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#e94560", marginBottom: 24 }}>
            AI-Powered Ad Creation
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-2px" }}>
            Turn Any URL Into a<br />
            <span style={{ background: "linear-gradient(90deg, #e94560, #f5a623)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Professional Ad
            </span>
          </h1>
          <p style={{ color: "#888", fontSize: 18, marginBottom: 48, lineHeight: 1.6 }}>
            Paste your website URL and watch AI generate stream-ready video ads in seconds. No design skills needed.
          </p>

          <div style={{ display: "flex", gap: 12, background: "#0d0d1a", border: "1px solid #ffffff15", borderRadius: 16, padding: 8 }}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="https://yourwebsite.com"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 16, padding: "12px 16px" }}
            />
            <button
              onClick={handleGenerate}
              style={{ background: "linear-gradient(135deg, #e94560, #c73652)", border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Generate Ad →
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 48 }}>
            {["URL → Ad in 30s", "Full Editing", "Stream-Ready"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, color: "#666", fontSize: 14 }}>
                <span style={{ color: "#e94560" }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOADING STEP */}
      {step === "loading" && (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #e94560, #f5a623)", borderRadius: 16, margin: "0 auto 32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⚡</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Generating Your Ad...</h2>
          <p style={{ color: "#666", marginBottom: 40 }}>
            {progress < 30 ? "Scraping website content..." : progress < 60 ? "AI analyzing your brand..." : progress < 90 ? "Crafting ad copy..." : "Finalizing your ad..."}
          </p>
          <div style={{ background: "#0d0d1a", borderRadius: 100, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #e94560, #f5a623)", borderRadius: 100, transition: "width 0.5s ease" }} />
          </div>
          <p style={{ color: "#e94560", marginTop: 12, fontSize: 14, fontWeight: 600 }}>{progress}%</p>
        </div>
      )}

      {/* RESULT STEP */}
      {step === "result" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "1fr 420px", gap: 32 }}>

          {/* LEFT — Ad Preview */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>Ad Preview</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setEditMode(!editMode)} style={{ background: editMode ? "#e94560" : "#ffffff15", border: "1px solid #ffffff20", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  {editMode ? "✓ Editing" : "✏️ Edit"}
                </button>
                <button onClick={handleRegenerate} style={{ background: "#ffffff10", border: "1px solid #ffffff20", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                  🔁 Regenerate
                </button>
              </div>
            </div>

            {/* Ad Card */}
            <div style={{ background: currentAd.color, borderRadius: 20, overflow: "hidden", border: "1px solid #ffffff10", position: "relative", minHeight: 380 }}>
              {/* Stream bar */}
              <div style={{ background: "#00000060", padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #ffffff10" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e94560", animation: "pulse 1.5s infinite" }} />
                <span style={{ fontSize: 11, color: "#ffffff80", letterSpacing: 1 }}>LIVE STREAM AD • {length.toUpperCase()}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#ffffff50" }}>Oracle Cloud OCI</span>
              </div>

              <div style={{ padding: "48px 40px" }}>
                <div style={{ display: "inline-block", background: `${currentAd.accent}20`, border: `1px solid ${currentAd.accent}40`, borderRadius: 20, padding: "4px 14px", fontSize: 12, color: currentAd.accent, marginBottom: 20 }}>
                  {audience} • {tone}
                </div>

                {editMode ? (
                  <input value={headline} onChange={(e) => setHeadline(e.target.value)}
                    style={{ display: "block", width: "100%", background: "#ffffff10", border: `1px solid ${currentAd.accent}`, borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 28, fontWeight: 800, marginBottom: 16, outline: "none" }} />
                ) : (
                  <h2 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, letterSpacing: "-1px" }}>{displayHeadline}</h2>
                )}

                <p style={{ color: currentAd.accent, fontWeight: 600, marginBottom: 16, fontSize: 16 }}>{currentAd.subheadline}</p>

                {editMode ? (
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3}
                    style={{ display: "block", width: "100%", background: "#ffffff10", border: `1px solid ${currentAd.accent}`, borderRadius: 8, padding: "10px 14px", color: "#ccc", fontSize: 15, outline: "none", resize: "none", lineHeight: 1.6 }} />
                ) : (
                  <p style={{ color: "#cccccc", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>{displayBody}</p>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
                  <button style={{ background: currentAd.accent, border: "none", borderRadius: 10, padding: "14px 28px", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                    {currentAd.cta}
                  </button>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff10", borderRadius: 8, padding: "8px 12px" }}>
                    <span style={{ fontSize: 10, color: "#888" }}>QR Code</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,6px)", gap: 1, marginTop: 4 }}>
                      {Array(16).fill(0).map((_, i) => (
                        <div key={i} style={{ width: 6, height: 6, background: [0,1,4,5,10,11,14,15].includes(i) ? "#fff" : "transparent" }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Variations */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 }}>
              {sampleAds.map((ad, i) => (
                <div key={i} onClick={() => { setActiveAd(i); setHeadline(ad.headline); setBody(ad.body); }}
                  style={{ background: i === activeAd ? `${ad.accent}20` : "#0d0d1a", border: `1px solid ${i === activeAd ? ad.accent : "#ffffff15"}`, borderRadius: 12, padding: 14, cursor: "pointer" }}>
                  <div style={{ width: 20, height: 4, background: ad.accent, borderRadius: 2, marginBottom: 8 }} />
                  <p style={{ fontSize: 11, color: "#aaa", lineHeight: 1.4 }}>{ad.headline.slice(0, 40)}...</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "#666" }}>Variation {i + 1}</span>
                    <span style={{ fontSize: 11, color: ad.accent, fontWeight: 700 }}>Variation {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Edit Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          
            {/* Tone */}
            <div style={{ background: "#0d0d1a", border: "1px solid #ffffff15", borderRadius: 16, padding: 20 }}>
              <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>🎯 Tone</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tones.map((t) => (
                  <button key={t} onClick={() => setTone(t)}
                    style={{ background: tone === t ? "#e94560" : "#ffffff10", border: `1px solid ${tone === t ? "#e94560" : "#ffffff20"}`, borderRadius: 8, padding: "7px 14px", color: "#fff", cursor: "pointer", fontSize: 13 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div style={{ background: "#0d0d1a", border: "1px solid #ffffff15", borderRadius: 16, padding: 20 }}>
              <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>⏱ Ad Length</p>
              <div style={{ display: "flex", gap: 8 }}>
                {lengths.map((l) => (
                  <button key={l} onClick={() => setLength(l)}
                    style={{ flex: 1, background: length === l ? "#f5a623" : "#ffffff10", border: `1px solid ${length === l ? "#f5a623" : "#ffffff20"}`, borderRadius: 8, padding: "8px 0", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: length === l ? 700 : 400 }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div style={{ background: "#0d0d1a", border: "1px solid #ffffff15", borderRadius: 16, padding: 20 }}>
              <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>👥 Target Audience</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {audiences.map((a) => (
                  <button key={a} onClick={() => setAudience(a)}
                    style={{ background: audience === a ? "#0f3460" : "#ffffff08", border: `1px solid ${audience === a ? "#e94560" : "#ffffff15"}`, borderRadius: 8, padding: "10px 14px", color: audience === a ? "#fff" : "#888", cursor: "pointer", fontSize: 13, textAlign: "left" }}>
                    {audience === a ? "● " : "○ "}{a}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <button style={{ background: "linear-gradient(135deg, #e94560, #c73652)", border: "none", borderRadius: 12, padding: "16px", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
              ✓ Approve & Export Ad
            </button>
            <button onClick={() => setStep("input")} style={{ background: "transparent", border: "1px solid #ffffff20", borderRadius: 12, padding: "12px", color: "#888", cursor: "pointer", fontSize: 14 }}>
              ← Generate New Ad
            </button>
          </div>
        </div>
      )}
    </main>
  );
}