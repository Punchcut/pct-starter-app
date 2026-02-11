"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
import { StyleSelector } from "./StyleSelector";
import { DEFAULT_STYLE, type PoemStyle } from "../types/poemStyles";

const DEFAULT_POEM = `A blank canvas waits for you,
with tools and blocks to build upon.
AI whispers hints anew—
start small, dream big, create, have fun!`;

type GlitterParticle = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

const MAX_GLITTER_PARTICLE_COUNT = 42;
const GLITTER_BURST_DURATION_MS = 3600;

function toGlitterColor(index: number, sparkleRatio: number) {
  const baseHue = 38;
  const hueSpread = 70 + 85 * sparkleRatio;
  const centeredOffset = (((index * 53) % 360) - 180) / 180;
  const hue = (baseHue + hueSpread * centeredOffset + 360) % 360;
  const saturation = 58 + sparkleRatio * 20;
  const lightness = 63 + ((index * 13) % 14);

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

export function PoemCard() {
  const [poem, setPoem] = useState(DEFAULT_POEM);
  const [selectedStyle, setSelectedStyle] = useState<PoemStyle>(DEFAULT_STYLE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGlitterActive, setIsGlitterActive] = useState(false);
  const [glitterBurstId, setGlitterBurstId] = useState(0);
  const [glitterBalance, setGlitterBalance] = useState(42);
  const glitterTimeoutRef = useRef<number | null>(null);

  const particles = useMemo<GlitterParticle[]>(
    () =>
      Array.from({ length: MAX_GLITTER_PARTICLE_COUNT }, (_, id) => ({
        id,
        left: (id * 37) % 100,
        top: 4 + ((id * 17) % 30),
        size: 4 + ((id * 11) % 7),
        delay: (id % 9) * 0.06,
        duration: 1.8 + ((id * 13) % 5) * 0.32,
        drift: ((id * 29) % 76) - 38,
      })),
    [],
  );
  const sparkleRatio = glitterBalance / 100;
  const activeParticleCount = 24 + Math.round(sparkleRatio * 14);
  const activeParticles = particles.slice(0, activeParticleCount);

  useEffect(
    () => () => {
      if (glitterTimeoutRef.current) {
        window.clearTimeout(glitterTimeoutRef.current);
      }
    },
    [],
  );

  function triggerGlitterBurst() {
    setGlitterBurstId((prev) => prev + 1);
    setIsGlitterActive(true);

    if (glitterTimeoutRef.current) {
      window.clearTimeout(glitterTimeoutRef.current);
    }

    glitterTimeoutRef.current = window.setTimeout(() => {
      setIsGlitterActive(false);
    }, GLITTER_BURST_DURATION_MS);
  }

  async function handleRegenerate() {
    setIsLoading(true);
    setError(null);

    try {
      const newPoem = await generatePoem(selectedStyle);
      setPoem(newPoem);
      triggerGlitterBurst();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isGlitterActive ? (
        <div
          key={glitterBurstId}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
          style={
            {
              ["--glitter-flash-opacity" as string]: `${0.24 + sparkleRatio * 0.12}`,
              ["--glitter-flash-scale" as string]: `${1.2 + (1 - sparkleRatio) * 0.3}`,
              ["--glitter-fall-distance" as string]: `${62 + sparkleRatio * 12}vh`,
            } as CSSProperties
          }
        >
          <span className="glitter-flash absolute inset-0" />
          <span className="glitter-flash glitter-flash-alt absolute inset-0" />
          {activeParticles.map((particle) => {
            const sizeScale = 1.6 - sparkleRatio * 0.45;
            const twinklePeak = 1.25 + sparkleRatio * 0.55;
            const opacityPeak = 0.56 + sparkleRatio * 0.22;
            const glowRadius = 6 + sparkleRatio * 7;
            const glitterColor = toGlitterColor(particle.id, sparkleRatio);
            const isStarSparkle = particle.id % 7 === 0;
            const style: CSSProperties = {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size * sizeScale}px`,
              height: `${particle.size * sizeScale}px`,
              background: glitterColor,
              boxShadow: `0 0 ${glowRadius}px ${glitterColor}, 0 0 ${
                glowRadius * 1.5
              }px hsl(0 0% 100% / 0.28)`,
              clipPath: isStarSparkle
                ? "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)"
                : undefined,
              filter: `saturate(${1 + sparkleRatio * 0.18})`,
              animationDuration: `${particle.duration}s, ${Math.max(
                1.6,
                particle.duration * 0.75,
              )}s`,
              animationDelay: `${particle.delay}s, ${particle.delay}s`,
              ["--glitter-drift" as string]: `${particle.drift}px`,
              ["--glitter-rotation" as string]: `${
                (particle.id % 2 === 0 ? 1 : -1) * (90 + ((particle.id * 17) % 80))
              }deg`,
              ["--glitter-twinkle-peak" as string]: `${twinklePeak}`,
              ["--glitter-opacity-peak" as string]: `${opacityPeak}`,
            };

            return (
              <span
                key={particle.id}
                className="glitter-particle absolute rounded-full"
                style={style}
              />
            );
          })}
        </div>
      ) : null}
      <Card className="relative mx-auto w-full max-w-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Punchcut Starter App</CardTitle>
          <CardDescription>
            Batteries included foundation to vibecode on
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <StyleSelector
            selected={selectedStyle}
            onSelect={setSelectedStyle}
            disabled={isLoading}
          />
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <p className="whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
              {poem}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <label htmlFor="glitter-balance">Glitter size vs sparkle</label>
                <span>{glitterBalance}</span>
              </div>
              <input
                id="glitter-balance"
                type="range"
                min={0}
                max={100}
                step={1}
                value={glitterBalance}
                onChange={(event) =>
                  setGlitterBalance(Number(event.target.value))
                }
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-amber-500 dark:bg-zinc-700"
              />
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                0 = soft large glints, 100 = crisp fine sparkle
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleRegenerate}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate poem"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
