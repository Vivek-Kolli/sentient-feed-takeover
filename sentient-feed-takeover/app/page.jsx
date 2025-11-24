"use client";
import { useState } from "react";

const BACKGROUNDS = [
  "00_Gradient Sunrise30.png",
  "01_Gradient Sunrise29.png",
  "02_Gradient Sunrise28.png",
  "03_Gradient Sunrise27.png",
  "04_Gradient Sunrise26.png",
  "05_Gradient Sunrise25.png",
  "06_Gradient Sunrise24.png",
  "07_Gradient Sunrise23.png",
  "08_Gradient Sunrise22.png",
  "09_Gradient Sunrise21.png",
  "10_Gradient Sunrise20.png",
  "11_Gradient Sunrise19.png",
  "12_Gradient Sunrise18.png",
  "13_Gradient Sunrise17.png",
  "14_Gradient Sunrise16.png",
  "15_Gradient Sunrise15.png",
  "16_Gradient Sunrise14.png",
  "17_Gradient Sunrise13.png",
  "18_Gradient Sunrise12.png",
  "19_Gradient Sunrise11.png",
  "20_Gradient Sunrise10.png",
  "21_Gradient Sunrise09.png",
  "22_Gradient Sunrise08.png",
  "23_Gradient Sunrise07.png",
  "24_Gradient Sunrise06.png",
  "25_Gradient Sunrise05.png",
  "26_Gradient Sunrise04.png",
  "27_Gradient Sunrise03.png",
  "28_Gradient Sunrise01.png"
];

export default function Home() {
  const [selectedBg, setSelectedBg] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedBg || !file) {
      alert("Please select a background and upload an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("background", selectedBg);
    formData.append("file", file);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Error response:", errText);
        alert("There was an error generating the image.");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      console.error(err);
      alert("Unexpected error. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Sentient Feed Takeover (Test)</h1>
      <p style={{ maxWidth: 600, marginBottom: 30 }}>
        Choose a background, upload a photo, and generate a composited image. This prototype uses a simple
        high-contrast filter to approximate an outline effect. Later, this can be upgraded to a true AI line-art model.
      </p>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>1. Select a background</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBg(bg)}
              style={{
                border: selectedBg === bg ? "3px solid #0070f3" : "1px solid #ccc",
                padding: 0,
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
                background: "transparent",
              }}
            >
              <img
                src={`/${bg}`}
                alt={bg}
                style={{ display: "block", width: 160, height: 100, objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>2. Upload your image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </section>

      <section style={{ marginBottom: 30 }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#000",
            color: "#fff",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "Generating..." : "3. Generate"}
        </button>
      </section>

      <section>
        <h2 style={{ fontSize: 20, marginBottom: 10 }}>4. Result</h2>
        {result && (
          <div>
            <img
              src={result}
              alt="Result"
              style={{ maxWidth: "100%", width: 500, borderRadius: 12, border: "1px solid #ddd" }}
            />
            <div style={{ marginTop: 10 }}>
              <a
                href={result}
                download="sentient-feed-takeover.png"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontSize: 14,
                }}
              >
                Download Image
              </a>
            </div>
          </div>
        )}
        {!result && <p style={{ color: "#666" }}>Your generated image will appear here.</p>}
      </section>
    </main>
  );
}
