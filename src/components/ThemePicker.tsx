import { THEME_LIST, type ThemeKey } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ThemePicker({
  value,
  onChange,
}: {
  value: ThemeKey;
  onChange: (theme: ThemeKey) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Cover theme"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {THEME_LIST.map((theme) => {
        const selected = theme.key === value;
        return (
          <button
            key={theme.key}
            type="button"
            onClick={() => onChange(theme.key)}
            aria-pressed={selected}
            className={cn(
              "group relative rounded-[4px] border p-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
              selected
                ? "border-foreground/60 bg-card shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_12px_20px_-22px_rgba(38,36,31,0.6)]"
                : "border-border bg-card/50 hover:border-foreground/25 hover:bg-card",
            )}
          >
            <span
              className="relative block h-[62px] overflow-hidden rounded-[2px] border"
              style={{
                backgroundColor: theme.cover.bg,
                borderColor: theme.cover.line,
              }}
            >
              <span
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  background: `linear-gradient(180deg, ${theme.cover.line}, ${theme.cover.bg})`,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  opacity: 0.75,
                }}
              />
              <span
                className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: theme.envelope.seal }}
              />
            </span>
            <span className="mt-2.5 block text-[12.5px] font-medium leading-none text-foreground">
              {theme.label}
            </span>
            <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
              {theme.blurb}
            </span>
            {selected && (
              <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="size-3" aria-hidden="true" />
                <span className="sr-only">Selected</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
