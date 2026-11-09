import { draftLooksUsable, type BoxDraft } from "@/lib/box";

const DRAFT_KEY = "openwhen.draft.v1";

export function hasDraftContent(draft: BoxDraft): boolean {
  return Boolean(
    draft.title.trim() ||
    draft.recipientName.trim() ||
    draft.senderName.trim() ||
    draft.introduction.trim() ||
    draft.envelopes.length,
  );
}

export function loadStoredDraft(): BoxDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return draftLooksUsable(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function storeDraft(draft: BoxDraft): void {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // A full or blocked storage shouldn't interrupt writing.
  }
}

export function clearStoredDraft(): void {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
