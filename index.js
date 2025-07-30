
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import readline from "readline";
// import dotenv from "dotenv";

// dotenv.config();


// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// async function translateToGarhwali(text) {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//     systemInstruction: `
//       You are a Garhwali language expert. 
//       Translate ONLY from English or Hindi to Garhwali in Hinglish script.  
//       Return ONLY the translated Garhwali text.  
//       Example:
//       "Hello, how are you?" → "namste tum kan cho?"
//       "I love you" → "mai tumse pyaar karudu"
//       "What is your name?" → "tumharu naam kya cha?"
//     `,
//   });

//   const result = await model.generateContent(text);
//   return result.response.text();
// }


// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// async function startAgent() {
//   console.log("💬 Garhwali Translator AI Agent (type 'exit' to quit)");

//   rl.setPrompt("Enter text: ");
//   rl.prompt();

//   rl.on("line", async (line) => {
//     const userText = line.trim();
//     if (userText.toLowerCase() === "exit") {
//       rl.close();
//       return;
//     }

//     try {
//       const translation = await translateToGarhwali(userText);
//       console.log(`📝 Garhwali: ${translation}`);
//     } catch (error) {
//       console.error("❌ Error translating:", error.message);
//     }

//     rl.prompt();
//   });
// }

// startAgent();


// server/index.js
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

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
