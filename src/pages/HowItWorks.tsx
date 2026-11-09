import { EnvelopeCard } from "@/components/EnvelopeCard";
import { PageHeading } from "@/components/PageHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { THEMES } from "@/lib/themes";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const STEPS = [
  {
    title: "Make a box",
    body: "Give it a name, say who it's for, and sign it with your own name. Add a short note if you'd like — the sort of thing you'd say while handing it over.",
  },
  {
    title: "Write your envelopes",
    body: "Each envelope gets a title, like “Open when you're bored” or “Open on your birthday”. A short hint on the outside helps them choose.",
  },
  {
    title: "Fill them with something",
    body: "A written message, a photo, a memory with a date, a little activity to try, or a link to a song. Envelopes can hold more than one thing.",
  },
  {
    title: "Choose the cover",
    body: "Pick a paper theme — quiet lavender, warm peach, rose garden, midnight letters, classic paper or plain cream. It changes the box, not your words.",
  },
  {
    title: "Send one link",
    body: "Your box gets its own private link. Send it however you usually talk. The other person doesn't need to sign up or install anything.",
  },
  {
    title: "Let them open it",
    body: "They'll see their name on the cover, your note, and the whole collection of envelopes. The rest is up to them.",
  },
];

export default function HowItWorks() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <PageHeading
          eyebrow="How it works"
          title="A box of things to open later."
          lede="Open When is a small collection of envelopes made for one person. Here's what happens between the idea and their first opened envelope."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <ol className="space-y-0">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border py-7 first:border-t-0 first:pt-0 sm:grid-cols-[3rem_1fr]"
              >
                <span className="font-serif text-[1.6rem] leading-none text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="font-serif text-[22px] leading-tight">
                    {step.title}
                  </h2>
                  <p className="mt-2 max-w-lg text-[14.5px] leading-[1.8] text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
            <div className="paper-card rounded-sm p-6">
              <p className="eyebrow">What a box looks like</p>
              <div className="mt-5 space-y-4">
                <EnvelopeCard
                  theme={THEMES.rose}
                  title="Open when you miss me"
                  hint="A photo from that afternoon."
                  index={0}
                />
                <EnvelopeCard
                  theme={THEMES.classic}
                  title="Open when you need a reminder"
                  hint="You are doing better than you think."
                  index={1}
                />
              </div>
              <p className="mt-5 text-[12.5px] leading-relaxed text-muted-foreground">
                Every envelope is available straight away. The title is a
                suggestion, not a rule — they decide when the moment fits.
              </p>
            </div>

            <div className="border-l border-border pl-5">
              <p className="eyebrow">One honest note</p>
              <p className="mt-3 text-[13.5px] leading-[1.8] text-muted-foreground">
                Open When can't detect how someone is feeling or know when an
                exam has finished. Conditions like “open when you're sad” are
                written prompts, and the person opening the box chooses when to
                act on them.
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-20 border-t border-border pt-12">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "For the person opening it",
                body: "No account, no app, no sign-up. Just the link, their name, and a box of envelopes to browse.",
              },
              {
                title: "For the person making it",
                body: "Saving keeps the box in your account. You can come back and edit it later, and its link stays exactly the same.",
              },
              {
                title: "For the two of you",
                body: "It isn't a feed or a public page. Only people with the link can see the box, and nothing is listed or searchable.",
              },
            ].map((item) => (
              <div key={item.title} className="border-t border-border pt-5">
                <h3 className="font-serif text-[19px]">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.75] text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 flex flex-col items-start gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md font-serif text-[20px] leading-snug">
            Ready to make one? It takes about as long as writing a good letter.
          </p>
          <Button
            asChild
            size="lg"
            className="h-11 rounded-full px-6 text-[13px]"
          >
            <Link to="/create">
              Create a box
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
