import { THEMES, themeVars, type ThemeKey } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import type { ReactNode } from "react";

export function BoxCover({
  theme,
  title,
  subtitle,
  recipientName,
  senderName,
  introduction,
  envelopeCount,
  variant = "full",
  children,
  className,
}: {
  theme: ThemeKey;
  title: string;
  subtitle?: string | null;
  recipientName: string;
  senderName: string;
  introduction?: string | null;
  envelopeCount: number;
  variant?: "full" | "compact";
  children?: ReactNode;
  className?: string;
}) {
  const palette = THEMES[theme];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[3px] border shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_30px_50px_-42px_rgba(38,36,31,0.65)]",
        variant === "full" ? "p-7 sm:p-12" : "p-5 sm:p-7",
        className,
      )}
      style={{
        ...themeVars(palette),
        backgroundColor: palette.cover.bg,
        borderColor: palette.cover.line,
        color: palette.cover.ink,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <p
            className="eyebrow max-w-[70%] leading-relaxed"
            style={{ color: palette.cover.soft }}
          >
            {recipientName ? `A box for ${recipientName}` : "A box for someone"}
          </p>
          <span
            className={cn(
              "postage-stamp flex shrink-0 rotate-2 flex-col items-center justify-center gap-1 rounded-[2px]",
              variant === "full" ? "size-14" : "size-11",
            )}
            aria-hidden="true"
          >
            <Mail
              className={variant === "full" ? "size-4" : "size-3.5"}
              strokeWidth={1.4}
            />
            <span className="text-[6.5px] uppercase leading-none tracking-[0.16em]">
              open when
            </span>
          </span>
        </div>

        <h1
          className={cn(
            "mt-8 break-words font-serif leading-[1.06] text-balance",
            variant === "full"
              ? "text-[clamp(2.1rem,5vw,3.4rem)]"
              : "text-[clamp(1.45rem,3.4vw,2rem)]",
          )}
        >
          {title || "Your box name"}
        </h1>

        {subtitle ? (
          <p
            className={cn(
              "mt-3 font-serif italic",
              variant === "full" ? "text-[17px]" : "text-[14px]",
            )}
            style={{ color: palette.cover.soft }}
          >
            {subtitle}
          </p>
        ) : null}

        <div
          className="mt-7 h-px w-14"
          style={{ backgroundColor: palette.cover.accent }}
        />

        {introduction ? (
          <p
            className={cn(
              "mt-5 max-w-xl whitespace-pre-wrap font-serif leading-[1.8]",
              variant === "full"
                ? "text-[16.5px]"
                : "text-[13.5px] leading-[1.65]",
              variant === "compact" && "line-clamp-4",
            )}
          >
            {introduction}
          </p>
        ) : variant === "compact" ? (
          <p
            className="mt-5 max-w-xl font-serif text-[13.5px] italic leading-[1.65]"
            style={{ color: palette.cover.soft }}
          >
            A short note to open the box will sit here.
          </p>
        ) : null}

        <div
          className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t pt-4 text-[11.5px] uppercase tracking-[0.14em]"
          style={{ borderColor: palette.cover.line, color: palette.cover.soft }}
        >
          <span>{senderName ? `From ${senderName}` : "From you"}</span>
          <span>
            {envelopeCount} {envelopeCount === 1 ? "envelope" : "envelopes"}
          </span>
        </div>

        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </article>
  );
}
