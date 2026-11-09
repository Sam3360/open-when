import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  markClassName,
  textClassName,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 24 18"
        aria-hidden="true"
        fill="none"
        className={cn("size-[18px] shrink-0", markClassName)}
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="1" width="22" height="16" rx="1.4" />
        <path d="M1.8 2 12 10.4 22.2 2" />
        <path d="m4.6 15.2 5.3-5.4M19.4 15.2l-5.3-5.4" opacity="0.55" />
      </svg>
      <span
        className={cn(
          "font-serif text-[1.3rem] leading-none tracking-[-0.02em]",
          textClassName,
        )}
      >
        open <span className="italic">when</span>
      </span>
    </span>
  );
}
