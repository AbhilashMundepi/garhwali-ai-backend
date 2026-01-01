
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function translateToGarhwali(text) {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//     systemInstruction: `
//      you are a intellectual  chatbot you have to talk to me in a  and resolve my query.
//     `,
//   });

//   const result = await model.generateContent(text);
//   return result.response.text();
// }

// app.post("/translate", async (req, res) => {
//   try {
//     const { text } = req.body;
//     const translation = await translateToGarhwali(text);
//     res.json({ translation });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create model ONCE (important for speed)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: "Answer clearly, briefly, and helpfully.",
});

// Simple in-memory cache (for repeated queries)
const cache = new Map();

/**
 * Generate chatbot response (STREAMING for fast feel)
 */
async function getChatResponse(text) {
  const result = await model.generateContentStream(text);

  let finalText = "";
  for await (const chunk of result.stream) {
    finalText += chunk.text();
  }

  return finalText;
}

/**
 * Chat endpoint
 */
app.post("/chat", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Serve from cache if available
    if (cache.has(text)) {
      return res.json({ reply: cache.get(text) });
    }

    const reply = await getChatResponse(text);

    // Save to cache
    cache.set(text, reply);

    res.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Chatbot server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);


