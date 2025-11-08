export async function callGeminiAPI(prompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    alert("Missing Gemini API key! Add VITE_GEMINI_API_KEY to .env");
    return null;
  }

  // ✅ Use a model that exists for your key
  const model = "models/gemini-2.5-flash"; // or "models/gemini-flash-latest"
  const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      alert("Gemini API Error: " + (data.error?.message || "Unknown error"));
      return null;
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.output_text ||
      "";

    if (text.trim()) {
      console.log("✅ Gemini output:", text);
      return text;
    } else {
      console.warn("No text response from Gemini:", data);
      return null;
    }
  } catch (err) {
    console.error("Network or Fetch error:", err);
    alert("Network error while calling Gemini API. Check console.");
    return null;
  }
}
