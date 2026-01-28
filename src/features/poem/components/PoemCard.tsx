"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generatePoem } from "../api/generatePoem";

const DEFAULT_POEM = `A blank canvas waits for you,
with tools and blocks to build upon.
AI whispers hints anew—
start small, dream big, create, have fun!`;

export function PoemCard() {
  const [poem, setPoem] = useState(DEFAULT_POEM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegenerate() {
    setIsLoading(true);
    setError(null);

    try {
      const newPoem = await generatePoem();
      setPoem(newPoem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Punchcut Starter App</CardTitle>
        <CardDescription>
          Batteries included foundation to vibecode on
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
            {poem}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleRegenerate}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Re-generate description"}
        </Button>
      </CardFooter>
    </Card>
  );
}
