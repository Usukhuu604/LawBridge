// src/routes/chatbot.ts
import express from "express";
import dotenv from "dotenv";
import { chatWithBot } from "../lib/langchain"; // LangChain chatbot function байгаа файл

dotenv.config();
const router = express.Router();

router.post("/chatbot", async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question || !userId) {
      return res.status(400).json({ error: "Question and userId are required" });
    }

    const answer = await chatWithBot(question, userId);

    res.json({ answer });
  } catch (err) {
    console.error("❌ Chatbot route error:", err);
    res.status(500).json({ error: "Chatbot failed" });
  }
});

export default router;
