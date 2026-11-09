import { getAuthUserId } from "@convex-dev/auth/server";
import { generateRandomString, type RandomReader } from "@oslojs/crypto/random";
import { ConvexError, v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { envelopePayloadValidator, themeValidator } from "./validators";

const SHARE_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
const SHARE_ID_LENGTH = 16;
const MAX_ENVELOPES = 60;
const MAX_BLOCKS_PER_ENVELOPE = 12;

const random: RandomReader = {
  read(bytes: Uint8Array) {
    crypto.getRandomValues(bytes);
  },
};

/* -------------------------------------------------------------------------- */
/* Input cleanup + validation                                                 */
/* -------------------------------------------------------------------------- */

function text(
  value: string | undefined,
  max: number,
  message: string,
): string | undefined {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return undefined;
  if (trimmed.length > max) throw new ConvexError(message);
  return trimmed;
}

function requiredText(value: string, max: number, message: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new ConvexError(message);
  if (trimmed.length > max) throw new ConvexError(message);
  return trimmed;
}

function safeLinkUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new ConvexError("Please add a link address.");
  if (trimmed.length > 2000) throw new ConvexError("That link is too long.");
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new ConvexError(
      "That link doesn't look right. It should start with https://",
    );
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ConvexError("Only http and https links can be added.");
  }
  return parsed.toString();
}

function normalizeBlock(
  block: Doc<"envelopes">["blocks"][number],
): Doc<"envelopes">["blocks"][number] {
  switch (block.type) {
    case "text": {
      const value = requiredText(
        block.text,
        5000,
        "A written message can't be empty.",
      );
      return { id: block.id, type: "text", text: value };
    }
    case "image":
      return {
        id: block.id,
        type: "image",
        storageId: block.storageId,
        alt: text(
          block.alt,
          220,
          "That image description is a little too long.",
        ),
      };
    case "activity":
      return {
        id: block.id,
        type: "activity",
        title: requiredText(
          block.title,
          120,
          "Please give the little activity a name.",
        ),
        details: text(block.details, 1200, "That activity note is too long."),
      };
    case "memory":
      return {
        id: block.id,
        type: "memory",
        title: requiredText(
          block.title,
          120,
          "Please give the memory a title.",
        ),
        date: text(block.date, 60, "That memory date is too long."),
        description: text(
          block.description,
          2000,
          "That memory note is a little too long.",
        ),
        storageId: block.storageId,
        alt: text(
          block.alt,
          220,
          "That image description is a little too long.",
        ),
      };
    case "link":
      return {
        id: block.id,
        type: "link",
        title: requiredText(block.title, 120, "Please give the link a name."),
        url: safeLinkUrl(block.url),
        description: text(
          block.description,
          500,
          "That link note is too long.",
        ),
      };
  }
}

type EnvelopeInput = {
  title: string;
  hint?: string;
  blocks: Doc<"envelopes">["blocks"];
};

function normalizeEnvelopes(inputs: EnvelopeInput[]) {
  if (inputs.length > MAX_ENVELOPES) {
    throw new ConvexError(
      `A box can hold up to ${MAX_ENVELOPES} envelopes. That's already a lot of love.`,
    );
  }
  return inputs.map((envelope, index) => {
    const title = requiredText(
      envelope.title,
      90,
      "Every envelope needs a title — try “Open when you're bored”.",
    );
    if (envelope.blocks.length === 0) {
      throw new ConvexError(`“${title}” is still empty. Add something inside.`);
    }
    if (envelope.blocks.length > MAX_BLOCKS_PER_ENVELOPE) {
      throw new ConvexError(
        `“${title}” has too many pieces. Keep it to ${MAX_BLOCKS_PER_ENVELOPE} per envelope.`,
      );
    }
    const blocks = envelope.blocks.map(normalizeBlock);
    return {
      order: index,
      title,
      hint: text(envelope.hint, 160, "That hint is a little too long."),
      blocks,
    };
  });
}

function collectStorageIds(
  envelopes: { blocks: Doc<"envelopes">["blocks"] }[],
) {
  const ids = new Set<Id<"_storage">>();
  for (const envelope of envelopes) {
    for (const block of envelope.blocks) {
      if (block.type === "image") ids.add(block.storageId);
      if (block.type === "memory" && block.storageId) ids.add(block.storageId);
    }
  }
  return ids;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

async function requireUserId(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Please sign in to continue.");
  }
  return userId;
}

async function newShareId(ctx: MutationCtx) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidate = generateRandomString(
      random,
      SHARE_ALPHABET,
      SHARE_ID_LENGTH,
    );
    const existing = await ctx.db
      .query("boxes")
      .withIndex("by_shareId", (q) => q.eq("shareId", candidate))
      .unique();
    if (!existing) return candidate;
  }
  throw new ConvexError("Could not make a link just now. Please try again.");
}

async function withImageUrls(
  ctx: QueryCtx,
  blocks: Doc<"envelopes">["blocks"],
) {
  return await Promise.all(
    blocks.map(async (block) => {
      if (block.type === "image") {
        return {
          ...block,
          imageUrl: await ctx.storage.getUrl(block.storageId),
        };
      }
      if (block.type === "memory" && block.storageId) {
        return {
          ...block,
          imageUrl: await ctx.storage.getUrl(block.storageId),
        };
      }
      return { ...block, imageUrl: null };
    }),
  );
}

async function envelopesForBox(ctx: QueryCtx, boxId: Id<"boxes">) {
  const envelopes = await ctx.db
    .query("envelopes")
    .withIndex("by_box", (q) => q.eq("boxId", boxId))
    .collect();
  envelopes.sort((a, b) => a.order - b.order);
  return await Promise.all(
    envelopes.map(async (envelope) => ({
      id: envelope._id,
      title: envelope.title,
      hint: envelope.hint ?? null,
      blocks: await withImageUrls(ctx, envelope.blocks),
    })),
  );
}

/* -------------------------------------------------------------------------- */
/* Queries                                                                    */
/* -------------------------------------------------------------------------- */

/** All boxes owned by the signed-in creator, newest first. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const boxes = await ctx.db
      .query("boxes")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();
    boxes.sort((a, b) => b.createdAt - a.createdAt);

    return await Promise.all(
      boxes.map(async (box) => {
        const envelopes = await ctx.db
          .query("envelopes")
          .withIndex("by_box", (q) => q.eq("boxId", box._id))
          .collect();
        return {
          shareId: box.shareId,
          title: box.title,
          subtitle: box.subtitle ?? null,
          recipientName: box.recipientName,
          senderName: box.senderName,
          theme: box.theme,
          createdAt: box.createdAt,
          updatedAt: box.updatedAt,
          envelopeCount: envelopes.length,
        };
      }),
    );
  },
});

/**
 * Public recipient view. Anyone with the unguessable share id can read the
 * box; nothing that identifies the creator's account is returned here.
 */
export const getPublic = query({
  args: { shareId: v.string() },
  handler: async (ctx, { shareId }) => {
    const box = await ctx.db
      .query("boxes")
      .withIndex("by_shareId", (q) => q.eq("shareId", shareId))
      .unique();
    if (!box) return null;

    return {
      shareId: box.shareId,
      title: box.title,
      subtitle: box.subtitle ?? null,
      recipientName: box.recipientName,
      senderName: box.senderName,
      introduction: box.introduction ?? null,
      theme: box.theme,
      createdAt: box.createdAt,
      updatedAt: box.updatedAt,
      envelopes: await envelopesForBox(ctx, box._id),
    };
  },
});

/** Creator-only view used by the editor and the preview. */
export const getForEdit = query({
  args: { shareId: v.string() },
  handler: async (ctx, { shareId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const box = await ctx.db
      .query("boxes")
      .withIndex("by_shareId", (q) => q.eq("shareId", shareId))
      .unique();
    if (!box || box.ownerId !== userId) return null;

    return {
      shareId: box.shareId,
      title: box.title,
      subtitle: box.subtitle ?? null,
      recipientName: box.recipientName,
      senderName: box.senderName,
      introduction: box.introduction ?? null,
      theme: box.theme,
      createdAt: box.createdAt,
      updatedAt: box.updatedAt,
      envelopes: await envelopesForBox(ctx, box._id),
    };
  },
});

/* -------------------------------------------------------------------------- */
/* Mutations                                                                  */
/* -------------------------------------------------------------------------- */

const boxFields = {
  title: v.string(),
  subtitle: v.optional(v.string()),
  recipientName: v.string(),
  senderName: v.string(),
  introduction: v.optional(v.string()),
  theme: themeValidator,
  envelopes: v.array(envelopePayloadValidator),
};

function validateBoxFields(args: {
  title: string;
  subtitle?: string;
  recipientName: string;
  senderName: string;
  introduction?: string;
}) {
  return {
    title: requiredText(args.title, 90, "Please give your box a name."),
    subtitle: text(args.subtitle, 120, "That subtitle is a little too long."),
    recipientName: requiredText(
      args.recipientName,
      60,
      "Please add the name of the person this is for.",
    ),
    senderName: requiredText(
      args.senderName,
      60,
      "Please add your name so they know who it's from.",
    ),
    introduction: text(
      args.introduction,
      1500,
      "That introduction is a little too long.",
    ),
  };
}

export const create = mutation({
  args: boxFields,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const fields = validateBoxFields(args);
    const envelopes = normalizeEnvelopes(args.envelopes);
    const shareId = await newShareId(ctx);
    const now = Date.now();

    const boxId = await ctx.db.insert("boxes", {
      ownerId: userId,
      shareId,
      ...fields,
      theme: args.theme,
      createdAt: now,
      updatedAt: now,
    });

    for (const envelope of envelopes) {
      await ctx.db.insert("envelopes", {
        boxId,
        order: envelope.order,
        title: envelope.title,
        hint: envelope.hint,
        blocks: envelope.blocks,
        createdAt: now,
      });
    }

    return { shareId };
  },
});

export const update = mutation({
  args: { shareId: v.string(), ...boxFields },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const box = await ctx.db
      .query("boxes")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .unique();
    if (!box) throw new ConvexError("That box no longer exists.");
    if (box.ownerId !== userId) {
      throw new ConvexError("This box belongs to someone else.");
    }

    const fields = validateBoxFields(args);
    const envelopes = normalizeEnvelopes(args.envelopes);

    const existingEnvelopes = await ctx.db
      .query("envelopes")
      .withIndex("by_box", (q) => q.eq("boxId", box._id))
      .collect();
    const previousStorageIds = collectStorageIds(existingEnvelopes);
    const nextStorageIds = collectStorageIds(envelopes);

    await ctx.db.patch(box._id, {
      ...fields,
      theme: args.theme,
      updatedAt: Date.now(),
    });

    for (const envelope of existingEnvelopes) {
      await ctx.db.delete(envelope._id);
    }
    for (const envelope of envelopes) {
      await ctx.db.insert("envelopes", {
        boxId: box._id,
        order: envelope.order,
        title: envelope.title,
        hint: envelope.hint,
        blocks: envelope.blocks,
        createdAt: box.createdAt,
      });
    }

    // Clean up photos that were removed while editing.
    for (const storageId of previousStorageIds) {
      if (!nextStorageIds.has(storageId)) {
        await ctx.storage.delete(storageId);
      }
    }

    return { shareId: box.shareId };
  },
});

export const remove = mutation({
  args: { shareId: v.string() },
  handler: async (ctx, { shareId }) => {
    const userId = await requireUserId(ctx);
    const box = await ctx.db
      .query("boxes")
      .withIndex("by_shareId", (q) => q.eq("shareId", shareId))
      .unique();
    if (!box) return { deleted: false };
    if (box.ownerId !== userId) {
      throw new ConvexError("This box belongs to someone else.");
    }

    const envelopes = await ctx.db
      .query("envelopes")
      .withIndex("by_box", (q) => q.eq("boxId", box._id))
      .collect();
    const storageIds = collectStorageIds(envelopes);

    for (const envelope of envelopes) {
      await ctx.db.delete(envelope._id);
    }
    await ctx.db.delete(box._id);
    for (const storageId of storageIds) {
      await ctx.storage.delete(storageId);
    }

    return { deleted: true };
  },
});

/** One-time upload URL for photos. Only signed-in creators can upload. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Resolve an uploaded photo for the signed-in creator. Used to restore photo
 * previews after a page refresh while a box is still an unsaved draft.
 */
export const uploadUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.storage.getUrl(storageId);
  },
});
