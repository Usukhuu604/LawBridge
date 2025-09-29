// src/api/chat.ts
import { chatWithBot } from "@/lib/langchain";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, userId, options } = req.body;
    const response = await chatWithBot(message, userId, options);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
