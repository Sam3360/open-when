import {
  EnvelopeContent,
  type EnvelopeContentBlock,
} from "@/components/envelope/EnvelopeContent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { THEMES, type ThemeKey } from "@/lib/themes";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

export function EnvelopeViewer({
  title,
  index,
  theme,
  senderName,
  recipientName,
  blocks,
  onClose,
}: {
  title: string;
  index: number;
  theme: ThemeKey;
  senderName: string;
  recipientName?: string;
  blocks: EnvelopeContentBlock[];
  onClose: () => void;
}) {
  const palette = THEMES[theme];
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(Boolean(reduceMotion));

  useEffect(() => {
    const timeout = window.setTimeout(() => setRevealed(true), 560);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="paper-card max-h-[92vh] w-[calc(100%-1.5rem)] gap-0 overflow-y-auto p-0 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          The contents of this envelope, from {senderName}.
        </DialogDescription>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close envelope"
          className="absolute right-3 top-3 z-30 flex size-9 items-center justify-center rounded-full border border-border/80 bg-card/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
          <div
            className="relative overflow-hidden border-b border-border px-6 pb-6 pt-7 sm:px-8 sm:pb-7 sm:pt-8"
            style={{ backgroundColor: palette.envelope.paper }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-60"
              style={{
                background: `linear-gradient(180deg, ${palette.envelope.flap}, ${palette.envelope.paper})`,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
            <div className="relative">
              <p className="eyebrow text-[9.5px]">
                Envelope {String(index + 1).padStart(2, "0")}
                {recipientName ? ` · for ${recipientName}` : ""}
              </p>
              <h2 className="mt-3 max-w-[85%] break-words font-serif text-[clamp(1.6rem,4.5vw,2.15rem)] leading-[1.12]">
                {title}
              </h2>
              <p className="mt-2 text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">
                From {senderName}
              </p>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <EnvelopeContent blocks={blocks} senderName={senderName} />

            <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-full bg-transparent px-5 text-[12.5px]"
              >
                Back to envelopes
              </Button>
              <span className="font-serif text-[12px] italic text-muted-foreground">
                Take your time with this one.
              </span>
            </div>
          </div>
        </motion.div>

        {!revealed && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-start gap-8 bg-background px-6 pt-[14vh]">
            <div
              className="relative h-36 w-60 sm:h-44 sm:w-72"
              style={{ perspective: 900 }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 rounded-[4px] border"
                style={{
                  backgroundColor: palette.envelope.paper,
                  borderColor: palette.envelope.line,
                }}
              />
              <motion.div
                className="absolute inset-x-0 top-0 h-[46%] origin-top border-b"
                style={{
                  background: `linear-gradient(180deg, ${palette.envelope.flap}, ${palette.envelope.paper})`,
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  borderColor: palette.envelope.line,
                }}
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -168 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
              <div
                className="absolute left-1/2 top-[46%] flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white/90"
                style={{ backgroundColor: palette.envelope.seal }}
              >
                <Sparkles className="size-3" />
              </div>
            </div>
            <p className="max-w-xs text-center font-serif text-[17px] leading-snug text-muted-foreground">
              {title}
            </p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              Skip the animation
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
