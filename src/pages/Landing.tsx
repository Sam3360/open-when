import { BoxCover } from "@/components/BoxCover";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractShareId } from "@/lib/box";
import { THEMES } from "@/lib/themes";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, MailOpen } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const DEMO_ENVELOPES = [
  {
    theme: THEMES.lavender,
    title: "Open when you're sad",
    hint: "Something I hope makes today a little softer.",
  },
  {
    theme: THEMES.peach,
    title: "Open when you need a laugh",
    hint: "A photo I should probably apologise for.",
  },
  {
    theme: THEMES.classic,
    title: "Open on your birthday",
    hint: "Read this one with cake nearby.",
  },
  {
    theme: THEMES.rose,
    title: "Open when you miss me",
    hint: "I'm not that far away, really.",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [openDialog, setOpenDialog] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 0.7, 0.2, 1] as const },
      };

  function handleOpenBox(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const shareId = extractShareId(code);
    if (!shareId) {
      setCodeError(
        "That doesn't look like an Open When link. Paste the whole link, or just the last part of it.",
      );
      return;
    }
    setCodeError(null);
    setOpenDialog(false);
    navigate(`/box/${shareId}`);
  }

  return (
    <SiteLayout>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-16 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-28">
          <motion.div {...fadeUp}>
            <p className="eyebrow rule-label max-w-[19rem]">
              A small gift, kept for later
            </p>
            <h1 className="mt-7 font-serif text-[clamp(2.55rem,6vw,4.4rem)] leading-[0.99] tracking-[-0.025em]">
              A little something,
              <br />
              <span className="italic">for whenever you need it.</span>
            </h1>
            <p className="mt-7 max-w-[27rem] text-[15.5px] leading-[1.8] text-muted-foreground">
              Create a collection of personal messages, memories, and surprises
              for someone you care about. They can open each one when the moment
              feels right.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-6 text-[13.5px]"
              >
                <Link to="/create">
                  Create a surprise box
                  <ArrowRight className="ml-0.5 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => setOpenDialog(true)}
                className="h-12 rounded-full border-border bg-transparent px-6 text-[13.5px] hover:bg-card"
              >
                Open a box
              </Button>
            </div>
            <p className="mt-6 text-[12px] leading-relaxed text-muted-foreground">
              No account needed to open a box. One link, sent however you like.
            </p>
          </motion.div>

          {/* Hero composition */}
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 0.75, delay: 0.12, ease: [0.22, 0.7, 0.2, 1] }
            }
            className="relative mx-auto w-full max-w-[420px]"
          >
            <div className="relative rounded-[4px] border border-border/80 bg-card/50 p-4 pb-3 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_30px_50px_-46px_rgba(38,36,31,0.55)] sm:p-6 sm:pb-4">
              <span
                className="postage-stamp absolute right-3 top-3 z-10 flex size-11 rotate-3 flex-col items-center justify-center gap-0.5 rounded-[2px]"
                aria-hidden="true"
              >
                <MailOpen className="size-3.5" strokeWidth={1.4} />
                <span className="text-[6px] uppercase leading-none tracking-[0.14em]">
                  open when
                </span>
              </span>

              <div className="relative pt-7 sm:pt-5">
                <div className="relative z-0 rotate-[-2.5deg]">
                  <EnvelopeCard
                    theme={THEMES.lavender}
                    title="Open when you're sad"
                    hint="Something I hope makes today a little softer."
                    index={0}
                  />
                </div>
                <div className="relative z-10 ml-5 mt-[-2.25rem] rotate-[2deg] sm:ml-8">
                  <EnvelopeCard
                    theme={THEMES.peach}
                    title="Open when you need a laugh"
                    hint="A photo I should probably apologise for."
                    index={1}
                  />
                </div>
              </div>

              <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-border/80 pt-3">
                <p className="text-[9.5px] uppercase tracking-[0.16em] text-muted-foreground">
                  An example box
                </p>
                <p className="font-serif text-[11.5px] italic text-muted-foreground">
                  for Alex, from Jamie
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it works                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-border/80 bg-card/35">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 max-w-md font-serif text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.1]">
                Three quiet steps, and one link.
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="group inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
            >
              The longer version
              <ArrowUpRight
                className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {[
              {
                title: "Create",
                body: "Write messages, add photos, and prepare small surprises. A box can hold as many envelopes as you like.",
              },
              {
                title: "Personalize",
                body: "Name each envelope for a feeling or an occasion, choose a cover, and arrange everything in the order you like.",
              },
              {
                title: "Send",
                body: "Share one link with the person it's for. They don't need an account — they just open the box.",
              },
            ].map((step, index) => (
              <div key={step.title} className="border-t border-border pt-5">
                <span className="eyebrow">Step {index + 1}</span>
                <h3 className="mt-3 font-serif text-[22px] leading-tight">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.75] text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Example envelopes                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="max-w-xl">
          <p className="eyebrow">For scale, some examples</p>
          <h2 className="mt-3 font-serif text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.08]">
            Envelopes for the days that need one.
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.75] text-muted-foreground">
            Each envelope is a small, self-contained gift: a note, a photograph,
            a memory, a song to listen to, or something to do. These are
            samples, not a real box.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_ENVELOPES.map((envelope, index) => (
            <EnvelopeCard
              key={envelope.title}
              theme={envelope.theme}
              title={envelope.title}
              hint={envelope.hint}
              index={index}
            />
          ))}
        </div>
        <p className="mt-6 text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground/70">
          Sample envelopes · an example box for Alex, from Jamie
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Emotional explanation                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-border/80 bg-card/40">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <h2 className="font-serif text-[clamp(1.9rem,4.2vw,2.9rem)] leading-[1.07] text-balance">
            Not everything needs to be sent right away.
          </h2>
          <div>
            <p className="text-[15.5px] leading-[1.85] text-muted-foreground">
              Some things are better kept for the moment they're needed. A
              message for a hard week. A photograph for a birthday months from
              now. A reminder that someone was thinking of you before you even
              knew you'd need it.
            </p>
            <p className="mt-5 text-[15.5px] leading-[1.85] text-muted-foreground">
              Open When lets you write those things down, put them in envelopes,
              and hand the whole box over — patiently waiting.
            </p>
            <blockquote className="mt-9 border-l border-border pl-5 font-serif text-[19px] italic leading-[1.6] text-foreground">
              "You don't have to open everything at once. Save each envelope for
              when it feels right."
            </blockquote>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">Ready when you are</p>
          <h2 className="mt-4 max-w-2xl font-serif text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.06] text-balance">
            Make someone's ordinary day a little more special.
          </h2>
          <p className="mt-5 max-w-md text-[14.5px] leading-[1.8] text-muted-foreground">
            It takes a few minutes to make a box, and about a minute to send it.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-full px-7 text-[13.5px]"
          >
            <Link to="/create">
              Create your first box
              <ArrowRight className="ml-0.5 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="pointer-events-none mx-auto mt-16 hidden max-w-3xl sm:block">
          <BoxCover
            theme="classic"
            title="A Little Something for You"
            subtitle="For the days that need a little help."
            recipientName="Alex"
            senderName="Jamie"
            introduction="I made this little box for you. You don't have to open everything at once — save each envelope for when it feels right."
            envelopeCount={4}
            variant="compact"
            className="rotate-[-1deg] opacity-70"
          />
          <p className="mt-4 text-center text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground/70">
            An example cover · classic paper
          </p>
        </div>
      </section>

      {/* Open-a-box dialog */}
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);
          if (!open) setCodeError(null);
        }}
      >
        <DialogContent className="paper-card sm:max-w-md">
          <DialogHeader>
            <p className="eyebrow">Someone sent you something</p>
            <DialogTitle className="mt-2 font-serif text-2xl">
              Open a box
            </DialogTitle>
            <DialogDescription>
              Paste the link you were sent, or just the code at the end of it.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOpenBox} className="mt-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="box-code" className="text-[12px]">
                Box link or code
              </Label>
              <Input
                id="box-code"
                name="box-code"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setCodeError(null);
                }}
                placeholder="https://…/box/abc123"
                autoComplete="off"
                autoFocus
                aria-invalid={Boolean(codeError)}
                aria-describedby={codeError ? "box-code-error" : undefined}
              />
              {codeError && (
                <p
                  id="box-code-error"
                  role="alert"
                  className="text-[12px] leading-relaxed text-destructive"
                >
                  {codeError}
                </p>
              )}
            </div>
            <Button type="submit" className="h-10 w-full text-[13px]">
              Open the box
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <p className="text-center text-[11.5px] text-muted-foreground">
              Don't have one yet?{" "}
              <Link
                to="/create"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Make a box
              </Link>
              .
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
