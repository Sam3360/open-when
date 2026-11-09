import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StepIndicator({
  steps,
  current,
  maxReached,
  onSelect,
}: {
  steps: { key: string; label: string }[];
  current: number;
  maxReached: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Box creation progress" className="mt-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {steps.map((step, index) => {
          const active = index === current;
          const complete = index < current;
          const reachable = index <= maxReached;
          return (
            <li key={step.key} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => reachable && onSelect(index)}
                disabled={!reachable}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full px-1 py-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground",
                  reachable
                    ? "cursor-pointer text-muted-foreground hover:text-foreground"
                    : "cursor-default text-muted-foreground/50",
                  active && "text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border text-[10px] tabular-nums transition-colors",
                    active && "border-foreground bg-foreground text-background",
                    complete && "border-foreground/40 text-foreground",
                    !active && !complete && "border-border",
                  )}
                >
                  {complete ? (
                    <Check className="size-3" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="text-[10.5px] uppercase tracking-[0.16em]">
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden h-px w-5 bg-border sm:block"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
