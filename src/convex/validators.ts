import { v } from "convex/values";

/** Cover themes available when creating a box. */
export const themeValidator = v.union(
  v.literal("lavender"),
  v.literal("peach"),
  v.literal("rose"),
  v.literal("midnight"),
  v.literal("classic"),
  v.literal("cream"),
);

/**
 * A single piece of content inside an envelope. Blocks are stored in display
 * order inside the envelope, so one envelope can hold a message, a photo, a
 * memory and a small activity at the same time.
 */
export const contentBlockValidator = v.union(
  v.object({
    id: v.string(),
    type: v.literal("text"),
    text: v.string(),
  }),
  v.object({
    id: v.string(),
    type: v.literal("image"),
    storageId: v.id("_storage"),
    alt: v.optional(v.string()),
  }),
  v.object({
    id: v.string(),
    type: v.literal("activity"),
    title: v.string(),
    details: v.optional(v.string()),
  }),
  v.object({
    id: v.string(),
    type: v.literal("memory"),
    title: v.string(),
    date: v.optional(v.string()),
    description: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    alt: v.optional(v.string()),
  }),
  v.object({
    id: v.string(),
    type: v.literal("link"),
    title: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
  }),
);

/** The shape the creator editor sends for each envelope. */
export const envelopePayloadValidator = v.object({
  title: v.string(),
  hint: v.optional(v.string()),
  blocks: v.array(contentBlockValidator),
});

export type ThemeKey =
  | "lavender"
  | "peach"
  | "rose"
  | "midnight"
  | "classic"
  | "cream";
