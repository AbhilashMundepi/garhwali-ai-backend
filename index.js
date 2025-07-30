
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function translateToGarhwali(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
      You are a Garhwali language expert.
      Translate ONLY from English or Hindi to Garhwali in Hinglish script.
      Return ONLY the translated Garhwali text.
      Example:
      "Hello, how are you?" → "namste tum kan cho?"
      "I love you" → "mai tumse pyaar karudu"
      "What is your name?" → "tumharu naam kya cha?"
    `,
  });

  const result = await model.generateContent(text);
  return result.response.text();
}

app.post("/translate", async (req, res) => {
  try {
    const { text } = req.body;
    const translation = await translateToGarhwali(text);
    res.json({ translation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

