import { Wordmark } from "@/components/Wordmark";
import { Link } from "react-router";

const PRODUCT_LINKS = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/create", label: "Create a box" },
  { to: "/dashboard", label: "My boxes" },
];

const DETAIL_LINKS = [
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/80">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.6fr_1fr_1fr] md:gap-8">
        <div className="max-w-xs">
          <Link
            to="/"
            className="inline-block text-foreground transition-opacity hover:opacity-70"
            aria-label="Open When — home"
          >
            <Wordmark />
          </Link>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-muted-foreground">
            A little something, for whenever you need it.
          </p>
          <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground/80">
            Made for friends, families and anyone who likes to save a good
            thought for later.
          </p>
        </div>

        <nav aria-label="Product">
          <p className="eyebrow">The product</p>
          <ul className="mt-4 space-y-2.5">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More">
          <p className="eyebrow">The details</p>
          <ul className="mt-4 space-y-2.5">
            {DETAIL_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/about#contact"
                className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-[11.5px] text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Open When</p>
          <p className="font-serif italic">
            Some things are better saved for the right moment.
          </p>
        </div>
      </div>
    </footer>
  );
}
