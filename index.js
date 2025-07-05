import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS so your frontend can talk to this backend
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Configure OpenAI client with your API key from .env
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Send message to OpenAI chat completion
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.data.choices[0].message.content.trim();

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI API error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Something went wrong with Eloi." });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Eloi Chat Backend is running.");
});

app.listen(port, () => {
  console.log(`Eloi backend listening at http://localhost:${port}`);
});