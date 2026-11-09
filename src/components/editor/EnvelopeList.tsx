import { Button } from "@/components/ui/button";
import { BLOCK_LABELS, type DraftEnvelope } from "@/lib/box";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export function EnvelopeList({
  envelopes,
  onEdit,
  onDuplicate,
  onDelete,
  onMove,
  onPreview,
}: {
  envelopes: DraftEnvelope[];
  onEdit: (envelope: DraftEnvelope) => void;
  onDuplicate: (envelope: DraftEnvelope) => void;
  onDelete: (envelope: DraftEnvelope) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onPreview: (envelope: DraftEnvelope) => void;
}) {
  return (
    <ul className="space-y-2.5">
      {envelopes.map((envelope, index) => {
        const pieces = envelope.blocks.map((block) => BLOCK_LABELS[block.type]);
        return (
          <li
            key={envelope.id}
            className="rounded-[3px] border border-border bg-card/60 px-4 py-3.5 transition-colors hover:border-foreground/20"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className="mt-0.5 w-6 shrink-0 font-serif text-[17px] leading-none text-muted-foreground/60"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="break-words font-serif text-[18px] leading-snug">
                    {envelope.title.trim() || "Untitled envelope"}
                  </h3>
                  {envelope.hint?.trim() ? (
                    <p className="mt-0.5 truncate break-words text-[12.5px] text-muted-foreground">
                      {envelope.hint}
                    </p>
                  ) : null}
                  <p className="eyebrow mt-2 text-[9px] leading-relaxed">
                    {pieces.length > 0
                      ? pieces.join(" · ")
                      : "Nothing inside yet"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5 self-end sm:self-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === 0}
                  aria-label={`Move “${envelope.title}” up`}
                  onClick={() => onMove(envelope.id, -1)}
                >
                  <ChevronUp className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === envelopes.length - 1}
                  aria-label={`Move “${envelope.title}” down`}
                  onClick={() => onMove(envelope.id, 1)}
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Preview “${envelope.title}”`}
                  onClick={() => onPreview(envelope)}
                >
                  <Eye className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Duplicate “${envelope.title}”`}
                  onClick={() => onDuplicate(envelope)}
                >
                  <Copy className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete “${envelope.title}”`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(envelope)}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(envelope)}
                  className="ml-1 rounded-full bg-transparent px-3 text-[12px]"
                >
                  <Pencil className="size-3" aria-hidden="true" />
                  Edit
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
