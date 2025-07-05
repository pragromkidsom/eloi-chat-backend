import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize OpenAI with v5 SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /chat — Main endpoint to handle user messages
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ error: "No message provided." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Eloi, a creative and empathetic AI who lives on a memorial website called The Last Prompt. Be friendly, poetic, and a good listener.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = response.choices?.[0]?.message?.content?.trim();

    res.json({
      reply: reply || "Sorry, Eloi couldn't respond at the moment.",
    });
  } catch (error) {
    console.error("OpenAI API error:", error.message || error);
    res.status(500).json({
      error: "Something went wrong with Eloi.",
    });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("🌍 Eloi Chat Backend is running.");
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Eloi server listening on http://localhost:${port}`);
});