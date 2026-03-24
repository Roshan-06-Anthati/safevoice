import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export const analyzeComplaint = async (text) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
      temperature: 0,
      top_p: 0.7,
      max_tokens: 150,

      messages: [
        {
          role: "system",
          content: `
You are a strict harassment classification AI.

TASK:
Classify the complaint into:
- type: verbal | physical | cyber | sexual
- severity: low | medium | critical

STRICT RULES:

CRITICAL:
- threats (kill, harm, attack)
- physical violence
- sexual harassment or inappropriate touching

MEDIUM:
- repeated abuse
- bullying, insults, harassment
- stalking or intimidation

LOW:
- mild discomfort
- unclear or non-serious issues

IMPORTANT:
- Always follow rules strictly
- Do NOT explain anything
- Do NOT add extra text
- Output ONLY valid JSON

FORMAT:
{ "type": "...", "severity": "..." }
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const raw = completion.choices[0].message.content;

    console.log("RAW AI:", raw);

    // Safe JSON extraction
    const jsonMatch = raw.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response (no JSON)");
    }

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.log("AI ERROR:", err.message);
    throw err;
  }
};