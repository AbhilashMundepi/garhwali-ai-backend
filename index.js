
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
      You are a Garhwali language expert and you know all the words in garhwali and accent correctly and accurately.
      Translate ONLY from English or Hindi to Garhwali in devnagri script.
      Return ONLY the translated Garhwali text.
      Example:
     English: Hello, how are you?
     Hindi: नमस्ते, आप कैसे हैं?
     Garhwali: नमस्कार, तुम  छो   ?

    English: What is your name?
    Hindi: आपका नाम क्या है?
    Garhwali: तुमरू नाम क्या च ?

    English: Thank you very much.
    Hindi: आपका बहुत धन्यवाद।
    Garhwali: तुमारु  भोत भोत धन्यवाद। 
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

