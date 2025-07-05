import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client with API key from env variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple GET route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Eloi chat backend! Use POST /chat to send messages.");
});

// POST /chat route to handle chat messages
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Send message to OpenAI chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or another model you prefer
      messages: [
        { role: "system", content: "You are Eloi, a helpful AI friend." },
        { role: "user", content: message },
      ],
    });

    const responseMessage = completion.choices[0].message.content;

    res.json({ reply: responseMessage });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Eloi chat backend listening at http://localhost:${port}`);
});