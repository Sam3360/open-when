import { PageHeading } from "@/components/PageHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function About() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <PageHeading
          eyebrow="About"
          title="A quiet place for the things you'd rather say later."
          lede="Open When is a small, independent project about making thoughtful digital gifts for people you care about."
        />

        <div className="mt-12 space-y-6 text-[15.5px] leading-[1.9] text-muted-foreground">
          <p>
            Most messages are sent the moment they're written. That's usually
            right. But some things read better at a different time — the note
            meant for a bad week, the photograph saved for a birthday, the joke
            that will land better in February.
          </p>
          <p>
            So Open When is built around a simple idea: write it now, wrap it in
            an envelope, and let the other person choose the moment. They get a
            box with their name on it and a handful of envelopes, each waiting
            for its own kind of day.
          </p>
          <p className="font-serif text-[19px] italic leading-[1.75] text-foreground">
            It's meant to feel like a handwritten letter — not a notification.
          </p>
          <p>
            There are no streaks, no likes, and nothing to keep up with. No
            public profiles. You make something once, send it once, and it stays
            there for as long as it's useful.
          </p>
        </div>

        <div className="mt-12 border-y border-border py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Wordmark />
              <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
                Made for friends first — and for anyone else who likes saving a
                good thought for later.
              </p>
            </div>
            <Button asChild className="rounded-full px-5">
              <Link to="/create">
                Make a box
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <section id="contact" className="mt-12 scroll-mt-28">
          <h2 className="font-serif text-2xl">Say hello</h2>
          <p className="mt-3 text-[15px] leading-[1.85] text-muted-foreground">
            If something in Open When isn't working the way it should, or you
            have a thought about what would make a box lovelier, you can write
            to{" "}
            <a
              href="mailto:hello@openwhen.app"
              className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              hello@openwhen.app
            </a>
            . It's a small project, so replies may take a little while — a bit
            like a letter.
          </p>
          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground/80">
            If you received a box and have a question about it, the person who
            made it is the best person to ask.
          </p>
        </section>
      </div>
    </SiteLayout>
  );
}
