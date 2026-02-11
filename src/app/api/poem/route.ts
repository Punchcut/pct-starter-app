import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { POEM_STYLES, DEFAULT_STYLE } from "@/features/poem/types/poemStyles";

const BASE_CONTEXT = `The subject of the poem is: a starter app for people new to programming. It has basic features including AI, a clear structure to build on, and is meant to be a skeleton they can play with and extend. The tone should be warm, encouraging, and inviting—make people excited to start building!`;
const MODEL = "gpt-5.2";
const MAX_OUTPUT_TOKENS = 1024;
const REASONING_EFFORT = "none" as const;
const IS_DEV = process.env.NODE_ENV !== "production";

function roughTokenEstimate(text: string) {
  return Math.ceil(text.length / 4);
}

/**
 * POST /api/poem
 * Generates a new poem using the OpenAI Responses API (GPT-5 Mini).
 * Accepts an optional `styleId` in the request body to pick a poetic style.
 * API key is securely accessed on the server only.
 */
export async function POST(request: NextRequest) {
  const requestId = `poem-${Math.random().toString(36).slice(2, 8)}`;
  const routeStartedAt = Date.now();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error(`[${requestId}] OPENAI_API_KEY is missing`);
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to .env (or Vercel env) to use AI features." },
      { status: 500 }
    );
  }

  // Parse the optional styleId from the request body
  let styleId: string | undefined;
  try {
    const body = await request.json();
    styleId = body.styleId;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[${requestId}] Failed to parse request body, using default style`, {
      message,
    });
    // No body or invalid JSON — that's fine, use defaults
  }

  const style = POEM_STYLES.find((s) => s.id === styleId) ?? DEFAULT_STYLE;

  const input = "Write a poem about this starter app in the style described in your instructions.";
  const instructions = `You are a creative poet. ${style.instruction}

${BASE_CONTEXT}

Output only the poem, no title or explanation.`;
  const promptStats = {
    model: MODEL,
    reasoningEffort: REASONING_EFFORT,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    selectedStyleId: style.id,
    instructionChars: instructions.length,
    inputChars: input.length,
    estimatedInstructionTokens: roughTokenEstimate(instructions),
    estimatedInputTokens: roughTokenEstimate(input),
    estimatedPromptTokens: roughTokenEstimate(instructions) + roughTokenEstimate(input),
  };
  console.info(`[${requestId}] Starting poem generation`, promptStats);

  try {
    const openai = new OpenAI({ apiKey });
    const openAiStartedAt = Date.now();

    const response = await openai.responses.create({
      model: MODEL,
      instructions,
      input,
      reasoning: { effort: REASONING_EFFORT },
      max_output_tokens: MAX_OUTPUT_TOKENS,
    });
    const openAiDurationMs = Date.now() - openAiStartedAt;
    const usage = response.usage;
    const responseStats = {
      status: response.status ?? null,
      incompleteReason: response.incomplete_details?.reason ?? null,
      inputTokens: usage?.input_tokens ?? null,
      cachedInputTokens: usage?.input_tokens_details?.cached_tokens ?? null,
      outputTokens: usage?.output_tokens ?? null,
      reasoningTokens: usage?.output_tokens_details?.reasoning_tokens ?? null,
      totalTokens: usage?.total_tokens ?? null,
      outputTextChars: response.output_text?.length ?? 0,
      openAiDurationMs,
      routeDurationMs: Date.now() - routeStartedAt,
    };
    console.info(`[${requestId}] OpenAI response received`, responseStats);

    // Accept "completed" or "incomplete" (truncated) — still return whatever text we got
    const text = response.output_text?.trim();

    if (!text) {
      const errMsg =
        response.error?.message ??
        `Model response status: ${response.status ?? "unknown"}`;
      console.warn(`[${requestId}] Response had no output text`, {
        error: errMsg,
        responseStatus: response.status ?? null,
        incompleteReason: response.incomplete_details?.reason ?? null,
      });
      const errorPayload: {
        error: string;
        debug?: {
          requestId: string;
          promptStats: typeof promptStats;
          responseStats: typeof responseStats;
        };
      } = {
        error: `Poem generation failed: ${errMsg}`,
      };
      if (IS_DEV) {
        errorPayload.debug = {
          requestId,
          promptStats,
          responseStats,
        };
      }
      return NextResponse.json(
        errorPayload,
        { status: 500 }
      );
    }

    console.info(`[${requestId}] Returning poem`, {
      outputChars: text.length,
      routeDurationMs: Date.now() - routeStartedAt,
    });
    return NextResponse.json({ poem: text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`[${requestId}] OpenAI call failed`, {
      message,
      routeDurationMs: Date.now() - routeStartedAt,
    });
    const errorPayload: {
      error: string;
      debug?: {
        requestId: string;
        routeDurationMs: number;
      };
    } = { error: message };
    if (IS_DEV) {
      errorPayload.debug = {
        requestId,
        routeDurationMs: Date.now() - routeStartedAt,
      };
    }
    return NextResponse.json(
      errorPayload,
      { status: 500 }
    );
  }
}
