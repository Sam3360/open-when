import { BlockFields, Counter } from "@/components/envelope/BlockFields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BLOCK_LABELS,
  blockProblem,
  newId,
  type DraftBlock,
  type DraftEnvelope,
} from "@/lib/box";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Link2,
  MessageSquareText,
  Plus,
  Sprout,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState } from "react";

const MAX_BLOCKS = 12;

const BLOCK_TYPES: {
  type: DraftBlock["type"];
  label: string;
  icon: LucideIcon;
}[] = [
  { type: "text", label: "Message", icon: MessageSquareText },
  { type: "image", label: "Photo", icon: ImageIcon },
  { type: "activity", label: "Activity", icon: Sprout },
  { type: "memory", label: "Memory", icon: Bookmark },
  { type: "link", label: "Link", icon: Link2 },
];

function emptyEnvelope(): DraftEnvelope {
  return { id: newId(), title: "", hint: "", blocks: [] };
}

function cloneEnvelope(envelope: DraftEnvelope): DraftEnvelope {
  return {
    ...envelope,
    blocks: envelope.blocks.map((block) => ({ ...block })),
  };
}

function createBlock(type: DraftBlock["type"]): DraftBlock {
  switch (type) {
    case "text":
      return { id: newId(), type: "text", text: "" };
    case "image":
      return { id: newId(), type: "image", storageId: "", previewUrl: null };
    case "activity":
      return { id: newId(), type: "activity", title: "", details: "" };
    case "memory":
      return {
        id: newId(),
        type: "memory",
        title: "",
        date: "",
        description: "",
        previewUrl: null,
      };
    case "link":
      return { id: newId(), type: "link", title: "", url: "", description: "" };
  }
}

export function EnvelopeEditor({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: DraftEnvelope | null;
  onSave: (envelope: DraftEnvelope) => void;
}) {
  const [initialEnvelope] = useState<DraftEnvelope>(() =>
    initial ? cloneEnvelope(initial) : emptyEnvelope(),
  );
  const [envelope, setEnvelope] = useState<DraftEnvelope>(initialEnvelope);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const dirty = JSON.stringify(envelope) !== JSON.stringify(initialEnvelope);

  function updateBlock(id: string, next: DraftBlock) {
    setEnvelope((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === id ? next : block)),
    }));
  }

  function removeBlock(id: string) {
    setEnvelope((current) => ({
      ...current,
      blocks: current.blocks.filter((block) => block.id !== id),
    }));
  }

  function moveBlock(id: string, direction: -1 | 1) {
    setEnvelope((current) => {
      const index = current.blocks.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.blocks.length) {
        return current;
      }
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(index, 1);
      blocks.splice(target, 0, moved);
      return { ...current, blocks };
    });
  }

  function addBlock(type: DraftBlock["type"]) {
    if (envelope.blocks.length >= MAX_BLOCKS) return;
    setEnvelope((current) => ({
      ...current,
      blocks: [...current.blocks, createBlock(type)],
    }));
    setError(null);
    window.setTimeout(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      endRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "nearest",
      });
    }, 60);
  }

  function handleSave() {
    const title = envelope.title.trim();
    if (!title) {
      setError(
        "Give this envelope a title — something like “Open when you're bored”.",
      );
      return;
    }
    if (envelope.blocks.length === 0) {
      setError(
        "An empty envelope is a bit of a tease. Add a message, photo, or small thing inside.",
      );
      return;
    }
    for (const [index, block] of envelope.blocks.entries()) {
      const problem = blockProblem(block);
      if (problem) {
        setError(
          `Piece ${index + 1} (${BLOCK_LABELS[block.type]}): ${problem}`,
        );
        return;
      }
    }

    onSave({
      ...envelope,
      title,
      hint: envelope.hint?.trim() ? envelope.hint.trim() : undefined,
      blocks: envelope.blocks.map((block) => {
        if (block.type === "text") return { ...block, text: block.text.trim() };
        if (block.type === "activity") {
          return {
            ...block,
            title: block.title.trim(),
            details: block.details?.trim() || undefined,
          };
        }
        if (block.type === "memory") {
          return {
            ...block,
            title: block.title.trim(),
            date: block.date?.trim() || undefined,
            description: block.description?.trim() || undefined,
          };
        }
        if (block.type === "link") {
          return {
            ...block,
            title: block.title.trim(),
            url: block.url.trim(),
            description: block.description?.trim() || undefined,
          };
        }
        return block;
      }),
    });
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          !nextOpen &&
          dirty &&
          !window.confirm("Discard your changes to this envelope?")
        ) {
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="paper-card flex max-h-[92vh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-5 pr-14 sm:px-8">
          <p className="eyebrow">
            {initial ? "Editing an envelope" : "A new envelope"}
          </p>
          <DialogTitle className="mt-1.5 font-serif text-2xl">
            {initial ? "Change what's inside" : "What's inside this one?"}
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            One envelope can hold several pieces — a written note, a photo, a
            memory, something to do, or a link.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {error && (
            <p
              role="alert"
              className="mb-5 rounded-[3px] border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-destructive"
            >
              {error}
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-[1.6fr_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor="envelope-title" className="text-[12px]">
                Envelope title
              </Label>
              <Input
                id="envelope-title"
                value={envelope.title}
                maxLength={90}
                autoFocus
                placeholder="Open when you're sad"
                onChange={(event) =>
                  setEnvelope((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className="bg-background/60"
              />
              <Counter value={envelope.title.length} max={90} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="envelope-hint" className="text-[12px]">
                A hint for the outside{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="envelope-hint"
                value={envelope.hint ?? ""}
                maxLength={160}
                placeholder="Something for a softer day."
                onChange={(event) =>
                  setEnvelope((current) => ({
                    ...current,
                    hint: event.target.value,
                  }))
                }
                className="bg-background/60"
              />
              <Counter value={(envelope.hint ?? "").length} max={160} />
            </div>
          </div>

          <div className="mt-8 flex items-baseline justify-between gap-3 border-b border-border pb-2">
            <p className="eyebrow">Inside</p>
            <span className="text-[11px] text-muted-foreground">
              {envelope.blocks.length}{" "}
              {envelope.blocks.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {envelope.blocks.length === 0 && (
              <div className="rounded-[3px] border border-dashed border-input bg-card/40 px-5 py-8 text-center">
                <p className="font-serif text-[17px]">Nothing inside yet.</p>
                <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">
                  Start with a message, or add a photo and a small activity
                  around it.
                </p>
              </div>
            )}

            {envelope.blocks.map((block, index) => {
              const meta = BLOCK_TYPES.find(
                (entry) => entry.type === block.type,
              )!;
              const Icon = meta.icon;
              return (
                <div
                  key={block.id}
                  className="overflow-hidden rounded-[3px] border border-border bg-card/50"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-background/40 py-1.5 pl-3 pr-1.5">
                    <span className="eyebrow flex items-center gap-1.5 text-[9.5px]">
                      <Icon className="size-3.5" aria-hidden="true" />
                      {meta.label}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-7"
                        disabled={index === 0}
                        aria-label={`Move ${meta.label.toLowerCase()} up`}
                        onClick={() => moveBlock(block.id, -1)}
                      >
                        <ChevronUp className="size-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-7"
                        disabled={index === envelope.blocks.length - 1}
                        aria-label={`Move ${meta.label.toLowerCase()} down`}
                        onClick={() => moveBlock(block.id, 1)}
                      >
                        <ChevronDown className="size-3.5" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${meta.label.toLowerCase()}`}
                        onClick={() => removeBlock(block.id)}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <BlockFields
                      block={block}
                      onChange={(next) => updateBlock(block.id, next)}
                    />
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          <div className="mt-6">
            <p className="text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground">
              Add to this envelope
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {BLOCK_TYPES.map((entry) => {
                const Icon = entry.icon;
                return (
                  <Button
                    key={entry.type}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={envelope.blocks.length >= MAX_BLOCKS}
                    onClick={() => addBlock(entry.type)}
                    className={cn(
                      "rounded-full bg-card/60 text-[12px]",
                      envelope.blocks.length >= MAX_BLOCKS && "opacity-50",
                    )}
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                    <Icon className="size-3.5" aria-hidden="true" />
                    {entry.label}
                  </Button>
                );
              })}
            </div>
            {envelope.blocks.length >= MAX_BLOCKS && (
              <p className="mt-2 text-[11.5px] text-muted-foreground">
                That's plenty for one envelope. Make another one for the rest.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border bg-card/95 px-6 py-4 sm:px-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-full px-5"
          >
            {initial ? "Save envelope" : "Add envelope"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
