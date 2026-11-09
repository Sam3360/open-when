import { themeVars, type BoxTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function EnvelopeCard({
  theme,
  title,
  hint,
  index,
  onOpen,
  className,
  badge,
}: {
  theme: BoxTheme;
  title: string;
  hint?: string | null;
  index?: number;
  onOpen?: () => void;
  className?: string;
  badge?: string;
}) {
  const inner = (
    <div
      className="envelope-face flex h-full min-h-[218px] flex-col rounded-[4px] px-4 pb-4 pt-[6.1rem] sm:px-5"
      style={themeVars(theme)}
    >
      <span className="envelope-seal" aria-hidden="true">
        <Sparkles className="size-3" />
      </span>

      <div className="relative z-[1] flex items-center justify-between gap-2">
        {typeof index === "number" && (
          <span className="eyebrow text-[9.5px] tracking-[0.22em]">
            Envelope {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {badge && (
          <span className="rounded-full border border-border/80 bg-card/70 px-2 py-0.5 text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
            {badge}
          </span>
        )}
      </div>

      <p className="relative z-[1] mt-1.5 break-words font-serif text-[18px] leading-[1.18] text-foreground sm:text-[19px]">
        {title}
      </p>

      {hint ? (
        <p className="relative z-[1] mt-1.5 line-clamp-2 break-words text-[12.5px] leading-snug text-muted-foreground">
          {hint}
        </p>
      ) : null}

      <span className="relative z-[1] mt-auto flex items-center gap-1 pt-4 text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
        {onOpen ? "Open" : "Inside"}
        <ArrowUpRight className="size-3" aria-hidden="true" />
      </span>
    </div>
  );

  if (!onOpen) {
    return <div className={cn("envelope-card", className)}>{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "envelope-card group block w-full rounded-[4px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground",
        className,
      )}
      aria-label={`Open envelope: ${title}`}
    >
      {inner}
    </button>
  );
}
