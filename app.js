import "dotenv/config";
import express from "express";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {
    corrected: "",
    originalText: "",
    error: "",
  });
});

// AI-based grammar correction route
app.post("/correct", async (req, res) => {
  const text = req.body.text?.trim();

  if (!text) {
    return res.render("index", {
      corrected: "",
      originalText: "",
      error: "Please enter some text to correct.",
    });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY; // Ensure API key is correctly loaded
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Correct this sentence: ${text}` }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error:", errorText);
      return res.render("index", {
        corrected: "",
        originalText: text,
        error: `API Error: ${errorText}`,
      });
    }

    const data = await response.json();
    console.log("🔍 API Response:", JSON.stringify(data, null, 2));

    let correctedText = "No correction found.";

    if (data.candidates && data.candidates.length > 0) {
      correctedText = data.candidates[0]?.content?.parts[0]?.text || "Error: No correction provided.";
    }

    res.render("index", {
      corrected: correctedText,
      originalText: text,
      error: "",
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.render("index", {
      corrected: "",
      originalText: text,
      error: "Error: Something went wrong. Please try again.",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
