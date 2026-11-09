import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";

const NAV_LINKS = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About" },
];

export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const boxesHref = isAuthenticated
    ? "/dashboard"
    : `/auth?returnTo=${encodeURIComponent("/dashboard")}`;

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:h-[4.5rem] sm:px-8">
        <Link
          to="/"
          className="rounded-sm text-foreground transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          aria-label="Open When — home"
        >
          <Wordmark />
        </Link>

        {!minimal && (
          <>
            <nav
              aria-label="Main"
              className="hidden items-center gap-8 md:flex"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground",
                      isActive && "text-foreground",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to={boxesHref}
                className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                My boxes
              </NavLink>
            </nav>

            <div className="hidden md:block">
              <Button
                asChild
                size="sm"
                className="rounded-full px-5 text-[12.5px]"
              >
                <Link to="/create">Create a box</Link>
              </Button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Button
                asChild
                size="sm"
                className="rounded-full px-4 text-[12px]"
              >
                <Link to="/create">Create</Link>
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="-mr-1 flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {menuOpen ? (
                  <X className="size-5" aria-hidden="true" />
                ) : (
                  <Menu className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </>
        )}

        {minimal && (
          <Link
            to={boxesHref}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            My boxes
          </Link>
        )}
      </div>

      {!minimal && menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-border/80 bg-background px-5 pb-5 pt-3 md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {[...NAV_LINKS, { to: boxesHref, label: "My boxes" }].map(
              (link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-border/60 py-3.5 font-serif text-xl text-foreground last:border-b-0"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
