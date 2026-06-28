import Groq from "groq-sdk";
import { UserInput } from "@/lib/audit/types";

export default async function generateSummary(
  userInput: UserInput, 
): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: "Explain the AI Bubble" }],
  });

  return response.choices[0].message.content ?? "";
}
