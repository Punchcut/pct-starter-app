import { NextResponse } from "next/server";
import OpenAI from "openai";

const POEM_INSTRUCTIONS = `You are a friendly, creative poet. Write a short poem (4-6 lines) about what this app is: a starter app for people new to programming. It has basic features including AI, a clear structure to build on, and is meant to be a skeleton they can play with and extend.

The tone should be warm, encouraging, and inviting—make people excited to start building! Keep it playful and not too formal.

Output only the poem, no title or explanation.`;

/**
 * POST /api/poem
 * Generates a new poem using the OpenAI Responses API (GPT-5 Mini).
 * API key is securely accessed on the server only.
 */
export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to .env (or Vercel env) to use AI features." },
      { status: 500 }
    );
  }

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      reasoning: { effort: "minimal" },
      instructions: POEM_INSTRUCTIONS,
      input: "Write a short poem about this starter app as described in your instructions.",
      max_output_tokens: 2000,
    });

    if (response.status !== "completed" || !response.output_text) {
      const errMsg = response.error?.message ?? "Model response was not completed.";
      return NextResponse.json(
        { error: `Poem generation failed: ${errMsg}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ poem: response.output_text.trim() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
