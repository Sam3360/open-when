import type { DraftBlock, SavedBlock } from "@/lib/box";
import { cn } from "@/lib/utils";
import { Camera, ExternalLink, ImageOff, Link2, Sprout } from "lucide-react";

export type EnvelopeContentBlock =
  | { id: string; type: "text"; text: string }
  | {
      id: string;
      type: "image";
      imageUrl: string | null;
      alt?: string | null;
    }
  | {
      id: string;
      type: "activity";
      title: string;
      details?: string | null;
    }
  | {
      id: string;
      type: "memory";
      title: string;
      date?: string | null;
      description?: string | null;
      imageUrl?: string | null;
      alt?: string | null;
    }
  | {
      id: string;
      type: "link";
      title: string;
      url: string;
      description?: string | null;
    };

export function blocksFromSaved(blocks: SavedBlock[]): EnvelopeContentBlock[] {
  return blocks.map((block) => {
    switch (block.type) {
      case "text":
        return { id: block.id, type: "text", text: block.text };
      case "image":
        return {
          id: block.id,
          type: "image",
          imageUrl: block.imageUrl,
          alt: block.alt,
        };
      case "activity":
        return {
          id: block.id,
          type: "activity",
          title: block.title,
          details: block.details,
        };
      case "memory":
        return {
          id: block.id,
          type: "memory",
          title: block.title,
          date: block.date,
          description: block.description,
          imageUrl: block.imageUrl,
          alt: block.alt,
        };
      case "link":
        return {
          id: block.id,
          type: "link",
          title: block.title,
          url: block.url,
          description: block.description,
        };
    }
  });
}

export function blocksFromDraft(blocks: DraftBlock[]): EnvelopeContentBlock[] {
  return blocks.map((block) => {
    switch (block.type) {
      case "text":
        return { id: block.id, type: "text", text: block.text };
      case "image":
        return {
          id: block.id,
          type: "image",
          imageUrl: block.previewUrl ?? null,
          alt: block.alt,
        };
      case "activity":
        return {
          id: block.id,
          type: "activity",
          title: block.title,
          details: block.details,
        };
      case "memory":
        return {
          id: block.id,
          type: "memory",
          title: block.title,
          date: block.date,
          description: block.description,
          imageUrl: block.previewUrl ?? null,
          alt: block.alt,
        };
      case "link":
        return {
          id: block.id,
          type: "link",
          title: block.title,
          url: block.url,
          description: block.description,
        };
    }
  });
}

function safeHttpUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }
  return null;
}

export function EnvelopeContent({
  blocks,
  senderName,
}: {
  blocks: EnvelopeContentBlock[];
  senderName?: string;
}) {
  return (
    <div className="space-y-7">
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            return (
              <p
                key={block.id}
                className="whitespace-pre-wrap break-words font-serif text-[16.5px] leading-[1.9] text-foreground/90"
              >
                {block.text}
              </p>
            );

          case "image":
            return (
              <figure key={block.id} className="space-y-2">
                {block.imageUrl ? (
                  <img
                    src={block.imageUrl}
                    alt={
                      block.alt?.trim() ||
                      `A photo from ${senderName ?? "the sender"}`
                    }
                    loading="lazy"
                    decoding="async"
                    className="max-h-[62vh] w-full rounded-[3px] border border-border bg-muted/50 object-contain"
                  />
                ) : (
                  <BrokenImage />
                )}
                {block.alt?.trim() ? (
                  <figcaption className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <Camera className="size-3" aria-hidden="true" />
                    {block.alt.trim()}
                  </figcaption>
                ) : null}
              </figure>
            );

          case "activity":
            return (
              <div
                key={block.id}
                className="rounded-[3px] border border-dashed border-input bg-card/60 p-5"
              >
                <p className="eyebrow flex items-center gap-1.5">
                  <Sprout className="size-3.5" aria-hidden="true" />A little
                  thing to do
                </p>
                <h3 className="mt-2.5 break-words font-serif text-[19px] leading-snug">
                  {block.title}
                </h3>
                {block.details ? (
                  <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.8] text-muted-foreground">
                    {block.details}
                  </p>
                ) : null}
              </div>
            );

          case "memory":
            return (
              <div
                key={block.id}
                className="rounded-[3px] border border-border bg-card/70 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="break-words font-serif text-[20px] leading-snug">
                    {block.title}
                  </h3>
                  {block.date ? (
                    <span className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                      {block.date}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 h-px w-10 bg-border" />
                {block.imageUrl ? (
                  <img
                    src={block.imageUrl}
                    alt={
                      block.alt?.trim() ||
                      `A memory shared by ${senderName ?? "the sender"}`
                    }
                    loading="lazy"
                    decoding="async"
                    className="mt-4 max-h-[52vh] w-full rounded-[2px] border border-border object-contain bg-muted/40"
                  />
                ) : null}
                {block.description ? (
                  <p className="mt-4 whitespace-pre-wrap text-[14.5px] leading-[1.85] text-muted-foreground">
                    {block.description}
                  </p>
                ) : null}
              </div>
            );

          case "link": {
            const href = safeHttpUrl(block.url);
            if (!href) {
              return (
                <div
                  key={block.id}
                  className="rounded-[3px] border border-border bg-card/50 p-4 text-[13px] text-muted-foreground"
                >
                  This link couldn't be opened.
                </div>
              );
            }
            let host = href;
            try {
              host = new URL(href).hostname.replace(/^www\./, "");
            } catch {
              /* keep full url */
            }
            return (
              <a
                key={block.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex items-start gap-3 rounded-[3px] border border-border bg-card/70 p-4 transition-colors hover:border-foreground/30 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground">
                  <Link2 className="size-3.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="break-words text-[14px] font-medium text-foreground">
                      {block.title}
                    </span>
                    <ExternalLink
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      )}
                      aria-hidden="true"
                    />
                  </span>
                  {block.description ? (
                    <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                      {block.description}
                    </span>
                  ) : null}
                  <span className="mt-1 block truncate text-[11.5px] text-muted-foreground/80">
                    {host}
                  </span>
                </span>
              </a>
            );
          }
        }
      })}
    </div>
  );
}

function BrokenImage() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-[3px] border border-dashed border-input bg-muted/30 p-6 text-center">
      <ImageOff className="size-5 text-muted-foreground" aria-hidden="true" />
      <p className="text-[12.5px] text-muted-foreground">
        This photo couldn't be loaded.
      </p>
    </div>
  );
}
