
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
     you are a hindi language chatbot you have to talk to me in a hindi and resolve my query.
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

