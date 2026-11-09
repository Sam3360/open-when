import type { FunctionArgs, FunctionReturnType } from "convex/server";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { isThemeKey, type ThemeKey } from "@/lib/themes";

export type PublicBox = NonNullable<
  FunctionReturnType<typeof api.boxes.getPublic>
>;
export type PublicEnvelope = PublicBox["envelopes"][number];
export type SavedBlock = PublicEnvelope["blocks"][number];

export type EnvelopePayload = FunctionArgs<
  typeof api.boxes.create
>["envelopes"];
export type BlockPayload = EnvelopePayload[number]["blocks"][number];

export type DraftBlock =
  | { id: string; type: "text"; text: string }
  | {
      id: string;
      type: "image";
      storageId: string;
      alt?: string;
      previewUrl?: string | null;
    }
  | { id: string; type: "activity"; title: string; details?: string }
  | {
      id: string;
      type: "memory";
      title: string;
      date?: string;
      description?: string;
      storageId?: string;
      alt?: string;
      previewUrl?: string | null;
    }
  | {
      id: string;
      type: "link";
      title: string;
      url: string;
      description?: string;
    };

export type DraftEnvelope = {
  id: string;
  title: string;
  hint?: string;
  blocks: DraftBlock[];
};

export type BoxDraft = {
  title: string;
  subtitle: string;
  recipientName: string;
  senderName: string;
  introduction: string;
  theme: ThemeKey;
  envelopes: DraftEnvelope[];
};

export const EMPTY_DRAFT: BoxDraft = {
  title: "",
  subtitle: "",
  recipientName: "",
  senderName: "",
  introduction: "",
  theme: "classic",
  envelopes: [],
};

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Turn server data into an editable draft, keeping uploaded photo previews. */
export function draftFromBox(box: PublicBox): BoxDraft {
  return {
    title: box.title,
    subtitle: box.subtitle ?? "",
    recipientName: box.recipientName,
    senderName: box.senderName,
    introduction: box.introduction ?? "",
    theme: box.theme,
    envelopes: box.envelopes.map((envelope) => ({
      id: envelope.id,
      title: envelope.title,
      hint: envelope.hint ?? "",
      blocks: envelope.blocks.map(fromSavedBlock),
    })),
  };
}

function fromSavedBlock(block: SavedBlock): DraftBlock {
  switch (block.type) {
    case "text":
      return { id: block.id, type: "text", text: block.text };
    case "image":
      return {
        id: block.id,
        type: "image",
        storageId: block.storageId,
        alt: block.alt,
        previewUrl: block.imageUrl,
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
        storageId: block.storageId,
        alt: block.alt,
        previewUrl: block.imageUrl,
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
}

function toPayloadBlock(block: DraftBlock): BlockPayload {
  switch (block.type) {
    case "text":
      return { id: block.id, type: "text", text: block.text };
    case "image":
      return {
        id: block.id,
        type: "image",
        storageId: block.storageId as Id<"_storage">,
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
        storageId: block.storageId
          ? (block.storageId as Id<"_storage">)
          : undefined,
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
}

export function draftToPayloadEnvelopes(draft: BoxDraft): EnvelopePayload {
  return draft.envelopes.map((envelope) => ({
    title: envelope.title,
    hint: envelope.hint?.trim() ? envelope.hint.trim() : undefined,
    blocks: envelope.blocks.map(toPayloadBlock),
  }));
}

export const BLOCK_LABELS: Record<DraftBlock["type"], string> = {
  text: "A message",
  image: "A photo",
  activity: "A little activity",
  memory: "A memory",
  link: "A link",
};

/** Shared checks so a block is never saved half-finished. */
export function blockProblem(block: DraftBlock): string | null {
  switch (block.type) {
    case "text":
      return block.text.trim() ? null : "Write a few words first.";
    case "image":
      return block.storageId ? null : "Add a photo first.";
    case "activity":
      return block.title.trim() ? null : "Give the activity a name.";
    case "memory":
      return block.title.trim() ? null : "Give the memory a title.";
    case "link": {
      if (!block.title.trim()) return "Give the link a name.";
      const url = block.url.trim();
      if (!url) return "Add a link address.";
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          return "Only http and https links can be added.";
        }
      } catch {
        return "That link doesn't look right. It should start with https://";
      }
      return null;
    }
  }
}

/** Pick up a share id from a pasted link, path, or bare code. */
export function extractShareId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  const match = value.match(/\/box\/([a-z0-9]{6,40})/i);
  if (match) return match[1].toLowerCase();
  if (/^[a-z0-9]{6,40}$/i.test(value)) return value.toLowerCase();
  return null;
}

export function boxShareUrl(shareId: string): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/box/${shareId}`;
}

export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fall through to the older path
  }
  try {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(area);
    return copied;
  } catch {
    return false;
  }
}

export function draftLooksUsable(value: unknown): value is BoxDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<BoxDraft>;
  return (
    typeof draft.title === "string" &&
    typeof draft.recipientName === "string" &&
    typeof draft.senderName === "string" &&
    typeof draft.introduction === "string" &&
    typeof draft.subtitle === "string" &&
    isThemeKey(draft.theme) &&
    Array.isArray(draft.envelopes)
  );
}
