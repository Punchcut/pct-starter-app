"use client";

import { cn } from "@/lib/utils";
import { POEM_STYLES, type PoemStyle } from "../types/poemStyles";

interface StyleSelectorProps {
  selected: PoemStyle;
  onSelect: (style: PoemStyle) => void;
  disabled?: boolean;
}

export function StyleSelector({
  selected,
  onSelect,
  disabled,
}: StyleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Style
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {POEM_STYLES.map((style) => {
          const isSelected = selected.id === style.id;
          return (
            <button
              key={style.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(style)}
              className={cn(
                "flex flex-col items-start rounded-lg border px-2.5 py-2 text-left transition-all",
                "hover:bg-accent disabled:pointer-events-none disabled:opacity-50",
                isSelected
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border bg-background dark:bg-input/30"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium leading-tight",
                  isSelected
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {style.label}
              </span>
              <span className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                {style.poet}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
