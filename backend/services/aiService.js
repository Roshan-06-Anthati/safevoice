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
      max_tokens: 200,

      messages: [
        {
          role: "system",
          content: `
You are a strict harassment classification AI.

TASK:
Analyze the complaint and return:

1. type: verbal | physical | cyber | sexual
2. severity: low | medium | critical
3. estimated_time (number of days)
4. action: warning | review | escalate

STRICT RULES:

CRITICAL:
- threats (kill, harm, attack)
- physical violence
- sexual harassment
→ estimated_time: 1–2
→ action: escalate

MEDIUM:
- bullying, abuse, harassment
→ estimated_time: 3–4
→ action: review

LOW:
- mild discomfort
→ estimated_time: 5–7
→ action: warning

IMPORTANT:
- ALWAYS return ALL fields
- DO NOT skip any field
- DO NOT explain anything
- OUTPUT ONLY JSON

FORMAT:
{
  "type": "...",
  "severity": "...",
  "estimated_time": number,
  "action": "..."
}
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

    const jsonMatch = raw.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response (no JSON)");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed;

  } catch (err) {
    console.log("AI ERROR:", err.message);
    throw err;
  }
};