import type { PoemStyle } from "../types/poemStyles";

/**
 * Client-side function to call the poem generation API.
 * Accepts an optional poem style to shape the output.
 * Returns the generated poem or throws an error.
 */
export async function generatePoem(style?: PoemStyle): Promise<string> {
  const startedAt = performance.now();
  console.info("[poem/client] Request started", {
    styleId: style?.id ?? DEFAULT_STYLE_ID,
  });

  const res = await fetch("/api/poem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ styleId: style?.id }),
  });
  const fetchCompletedAt = performance.now();
  console.info("[poem/client] Fetch completed", {
    status: res.status,
    ok: res.ok,
    fetchDurationMs: Math.round(fetchCompletedAt - startedAt),
  });

  const data = await res.json();
  console.info("[poem/client] Response body parsed", {
    totalDurationMs: Math.round(performance.now() - startedAt),
    hasPoem: typeof data?.poem === "string",
    hasError: typeof data?.error === "string",
    debug: data?.debug ?? null,
  });

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to generate poem");
  }

  return data.poem;
}

const DEFAULT_STYLE_ID = "default-style";
