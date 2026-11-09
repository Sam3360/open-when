import { ImageUploader } from "@/components/ImageUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DraftBlock } from "@/lib/box";
import { cn } from "@/lib/utils";

export function BlockFields({
  block,
  onChange,
}: {
  block: DraftBlock;
  onChange: (block: DraftBlock) => void;
}) {
  switch (block.type) {
    case "text":
      return (
        <div className="space-y-1.5">
          <Label htmlFor={`${block.id}-text`} className="text-[12px]">
            Your message
          </Label>
          <Textarea
            id={`${block.id}-text`}
            value={block.text}
            maxLength={5000}
            rows={7}
            placeholder="Write it the way you'd say it…"
            onChange={(event) =>
              onChange({ ...block, text: event.target.value })
            }
            className="min-h-40 resize-y bg-background/60 font-serif text-[15px] leading-[1.85]"
          />
          <div className="flex justify-end">
            <Counter value={block.text.length} max={5000} />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <ImageUploader
            value={
              block.storageId && block.previewUrl
                ? { storageId: block.storageId, previewUrl: block.previewUrl }
                : null
            }
            onChange={(value) =>
              onChange({
                ...block,
                storageId: value?.storageId ?? "",
                previewUrl: value?.previewUrl ?? null,
              })
            }
          />
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-alt`} className="text-[12px]">
              Describe the photo{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id={`${block.id}-alt`}
              value={block.alt ?? ""}
              maxLength={220}
              placeholder="A photo of us on the beach, 2023"
              onChange={(event) =>
                onChange({ ...block, alt: event.target.value })
              }
              className="bg-background/60"
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Helps if they're using a screen reader, or on a slow connection.
            </p>
          </div>
        </div>
      );

    case "activity":
      return (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-title`} className="text-[12px]">
              The activity
            </Label>
            <Input
              id={`${block.id}-title`}
              value={block.title}
              maxLength={120}
              placeholder="Listen to our favourite song"
              onChange={(event) =>
                onChange({ ...block, title: event.target.value })
              }
              className="bg-background/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-details`} className="text-[12px]">
              A little guidance{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id={`${block.id}-details`}
              value={block.details ?? ""}
              maxLength={1200}
              rows={3}
              placeholder="Track three. Sit somewhere quiet. Think of me."
              onChange={(event) =>
                onChange({ ...block, details: event.target.value })
              }
              className="resize-y bg-background/60 text-[14px]"
            />
          </div>
        </div>
      );

    case "memory":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor={`${block.id}-title`} className="text-[12px]">
                Memory title
              </Label>
              <Input
                id={`${block.id}-title`}
                value={block.title}
                maxLength={120}
                placeholder="The night we missed the last train"
                onChange={(event) =>
                  onChange({ ...block, title: event.target.value })
                }
                className="bg-background/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${block.id}-date`} className="text-[12px]">
                When{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={`${block.id}-date`}
                value={block.date ?? ""}
                maxLength={60}
                placeholder="Summer 2019"
                onChange={(event) =>
                  onChange({ ...block, date: event.target.value })
                }
                className="bg-background/60"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-description`} className="text-[12px]">
              What happened
            </Label>
            <Textarea
              id={`${block.id}-description`}
              value={block.description ?? ""}
              maxLength={2000}
              rows={4}
              placeholder="We walked for an hour, bought terrible coffee, and it became one of my favourite evenings."
              onChange={(event) =>
                onChange({ ...block, description: event.target.value })
              }
              className="resize-y bg-background/60 text-[14px] leading-relaxed"
            />
            <Counter value={(block.description ?? "").length} max={2000} />
          </div>
          <div className="space-y-2">
            <p className="text-[12px] font-medium">
              A photo from then (optional)
            </p>
            <ImageUploader
              value={
                block.storageId && block.previewUrl
                  ? { storageId: block.storageId, previewUrl: block.previewUrl }
                  : null
              }
              onChange={(value) =>
                onChange({
                  ...block,
                  storageId: value?.storageId,
                  previewUrl: value?.previewUrl ?? null,
                })
              }
            />
          </div>
        </div>
      );

    case "link":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`${block.id}-title`} className="text-[12px]">
                What is it?
              </Label>
              <Input
                id={`${block.id}-title`}
                value={block.title}
                maxLength={120}
                placeholder="The song we played on repeat"
                onChange={(event) =>
                  onChange({ ...block, title: event.target.value })
                }
                className="bg-background/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${block.id}-url`} className="text-[12px]">
                Link address
              </Label>
              <Input
                id={`${block.id}-url`}
                type="url"
                value={block.url}
                maxLength={2000}
                placeholder="https://open.spotify.com/…"
                onChange={(event) =>
                  onChange({ ...block, url: event.target.value })
                }
                className="bg-background/60"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${block.id}-description`} className="text-[12px]">
              Why this one?{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id={`${block.id}-description`}
              value={block.description ?? ""}
              maxLength={500}
              rows={2}
              placeholder="Put it on and think of that drive home."
              onChange={(event) =>
                onChange({ ...block, description: event.target.value })
              }
              className="resize-y bg-background/60 text-[14px]"
            />
          </div>
        </div>
      );
  }
}

export function Counter({ value, max }: { value: number; max: number }) {
  const nearLimit = value > max * 0.92;
  return (
    <span
      className={cn(
        "text-[10.5px] tabular-nums text-muted-foreground",
        nearLimit && "text-destructive",
      )}
    >
      {value}/{max}
    </span>
  );
}
