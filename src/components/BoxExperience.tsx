import { BoxCover } from "@/components/BoxCover";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { EnvelopeViewer } from "@/components/EnvelopeViewer";
import { blocksFromSaved } from "@/components/envelope/EnvelopeContent";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import type { PublicBox, PublicEnvelope } from "@/lib/box";
import { THEMES } from "@/lib/themes";
import { motion, useReducedMotion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";

export function BoxExperience({
  box,
  banner,
}: {
  box: Pick<
    PublicBox,
    | "shareId"
    | "title"
    | "subtitle"
    | "recipientName"
    | "senderName"
    | "introduction"
    | "theme"
    | "envelopes"
  >;
  banner?: ReactNode;
}) {
  const [entered, setEntered] = useState(false);
  const [activeEnvelope, setActiveEnvelope] = useState<PublicEnvelope | null>(
    null,
  );
  const reduceMotion = useReducedMotion();
  const palette = THEMES[box.theme];

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 0.7, 0.2, 1] as const },
      };

  const header = (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
      <Link
        to="/"
        aria-label="Open When — home"
        className="text-foreground transition-opacity hover:opacity-70"
      >
        <Wordmark />
      </Link>
      <span className="hidden text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
        A box for {box.recipientName}
      </span>
    </header>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {header}
      {banner}

      {!entered ? (
        <motion.main
          key="cover"
          {...fade}
          className="flex flex-1 items-start justify-center px-4 pb-16 pt-4 sm:px-6 sm:pt-8"
        >
          <div className="w-full max-w-2xl">
            <p className="text-center font-serif text-[15px] italic text-muted-foreground">
              Someone made something for you.
            </p>
            <div className="mt-5">
              <BoxCover
                theme={box.theme}
                title={box.title}
                subtitle={box.subtitle}
                recipientName={box.recipientName}
                senderName={box.senderName}
                introduction={box.introduction}
                envelopeCount={box.envelopes.length}
              >
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setEntered(true)}
                  className="h-12 w-full rounded-full text-[13px] hover:opacity-90 sm:w-auto sm:px-7"
                  style={{
                    backgroundColor: palette.cover.ink,
                    color: palette.cover.bg,
                  }}
                >
                  <MailOpen className="size-4" aria-hidden="true" />
                  Open your box
                </Button>
              </BoxCover>
            </div>
            <p className="mt-5 text-center text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Made with love by {box.senderName}.
            </p>
            <p className="mt-2 text-center text-[11.5px] text-muted-foreground/80">
              No account needed. Nothing will disappear.
            </p>
          </div>
        </motion.main>
      ) : (
        <motion.main key="box" {...fade} className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-5 pb-20 pt-4 sm:px-8 sm:pt-6">
            <div className="border-b border-border/80 pb-7">
              <p className="eyebrow">A box for {box.recipientName}</p>
              <h1 className="mt-3 max-w-2xl break-words font-serif text-[clamp(2rem,4.6vw,3rem)] leading-[1.05] text-balance">
                {box.title}
              </h1>
              {box.subtitle ? (
                <p className="mt-2.5 font-serif text-[16px] italic text-muted-foreground">
                  {box.subtitle}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  From {box.senderName}
                </p>
                <span aria-hidden="true" className="h-3 w-px bg-border" />
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {box.envelopes.length}{" "}
                  {box.envelopes.length === 1 ? "envelope" : "envelopes"}
                </p>
                <button
                  type="button"
                  onClick={() => setEntered(false)}
                  className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                >
                  Read the note again
                </button>
              </div>
            </div>

            {box.envelopes.length === 0 ? (
              <div className="mt-10 rounded-[3px] border border-dashed border-input bg-card/40 px-6 py-14 text-center">
                <p className="font-serif text-xl">This box is empty for now.</p>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  The person who made it may still be filling the envelopes.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {box.envelopes.map((envelope, index) => (
                  <EnvelopeCard
                    key={envelope.id}
                    theme={palette}
                    title={envelope.title}
                    hint={envelope.hint}
                    index={index}
                    onOpen={() => setActiveEnvelope(envelope)}
                  />
                ))}
              </div>
            )}

            <p className="mt-10 max-w-md text-[12px] leading-relaxed text-muted-foreground">
              There's no right order. Open one now, or save them all for later —
              the box will keep them for you.
            </p>

            <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-5">
              <p className="font-serif text-[12px] italic text-muted-foreground">
                A little something, for whenever you need it.
              </p>
              <Link
                to="/"
                className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                Made with Open When
              </Link>
            </div>
          </div>
        </motion.main>
      )}

      {activeEnvelope && (
        <EnvelopeViewer
          key={activeEnvelope.id}
          title={activeEnvelope.title}
          index={box.envelopes.findIndex(
            (envelope) => envelope.id === activeEnvelope.id,
          )}
          theme={box.theme}
          senderName={box.senderName}
          recipientName={box.recipientName}
          blocks={blocksFromSaved(activeEnvelope.blocks)}
          onClose={() => setActiveEnvelope(null)}
        />
      )}
    </div>
  );
}
