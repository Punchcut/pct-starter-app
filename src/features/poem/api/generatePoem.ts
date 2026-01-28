/**
 * Client-side function to call the poem generation API.
 * Returns the generated poem or throws an error.
 */
export async function generatePoem(): Promise<string> {
  const res = await fetch("/api/poem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to generate poem");
  }

  return data.poem;
}
