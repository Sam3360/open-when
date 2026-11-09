import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { ReactNode } from "react";

export function SiteLayout({
  children,
  minimalHeader = false,
  className,
}: {
  children: ReactNode;
  minimalHeader?: boolean;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader minimal={minimalHeader} />
      <main className={className ?? "flex-1"}>{children}</main>
      <SiteFooter />
    </div>
  );
}
