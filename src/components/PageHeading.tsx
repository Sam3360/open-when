import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  return (
    <header
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}
    >
      <p className={cn("eyebrow", align === "center" && "justify-center")}>
        {eyebrow}
      </p>
      <h1 className="mt-4 font-serif text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.05] tracking-[-0.02em] text-balance">
        {title}
      </h1>
      {lede ? (
        <div className="mt-5 text-[15.5px] leading-[1.8] text-muted-foreground">
          {lede}
        </div>
      ) : null}
      {children}
    </header>
  );
}
