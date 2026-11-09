import { BoxCover } from "@/components/BoxCover";
import { EnvelopeCard } from "@/components/EnvelopeCard";
import { EnvelopeEditor } from "@/components/EnvelopeEditor";
import { EnvelopeViewer } from "@/components/EnvelopeViewer";
import { EnvelopeList } from "@/components/editor/EnvelopeList";
import { StepIndicator } from "@/components/editor/StepIndicator";
import { blocksFromDraft } from "@/components/envelope/EnvelopeContent";
import { SiteLayout } from "@/components/SiteLayout";
import { ThemePicker } from "@/components/ThemePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  clearStoredDraft,
  hasDraftContent,
  loadStoredDraft,
  storeDraft,
} from "@/lib/draft";
import {
  EMPTY_DRAFT,
  draftFromBox,
  draftToPayloadEnvelopes,
  newId,
  type BoxDraft,
  type DraftEnvelope,
} from "@/lib/box";
import { BOX_NAME_IDEAS, ENVELOPE_TEMPLATES } from "@/lib/templates";
import { THEMES } from "@/lib/themes";
import { useConvex, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const STEPS = [
  { key: "details", label: "Details" },
  { key: "cover", label: "The cover" },
  { key: "envelopes", label: "Envelopes" },
  { key: "review", label: "Review" },
];

const STEP_HEADINGS = [
  {
    title: "The details",
    hint: "A name for the box, and the two names that matter.",
  },
  {
    title: "The cover",
    hint: "This is what they'll see before they open anything.",
  },
  {
    title: "The envelopes",
    hint: "As many as you like. Each one opens on its own.",
  },
  {
    title: "Have a look",
    hint: "This is the real thing — save it when you're happy.",
  },
];

function validateStep(index: number, draft: BoxDraft) {
  const errors: Record<string, string> = {};
  if (index === 0) {
    if (!draft.title.trim()) {
      errors.title = "Please give your box a name.";
    } else if (draft.title.trim().length > 90) {
      errors.title = "That name is a little too long.";
    }
    if (!draft.recipientName.trim()) {
      errors.recipientName = "Who is this box for?";
    }
    if (!draft.senderName.trim()) {
      errors.senderName = "Add your name so they know who it's from.";
    }
  }
  if (index === 2) {
    if (draft.envelopes.length === 0) {
      errors.envelopes = "Add at least one envelope before you continue.";
    } else if (
      draft.envelopes.some(
        (envelope) => !envelope.title.trim() || envelope.blocks.length === 0,
      )
    ) {
      errors.envelopes =
        "One of your envelopes is still empty. Open it and add something inside.";
    }
  }
  return errors;
}

function readableSaveError(error: unknown): string {
  if (error instanceof ConvexError) {
    const data = error.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message;
    }
  }
  return "We couldn't save the box just now. Your words are still here — check your connection and try again.";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="text-[11.5px] leading-relaxed text-destructive"
    >
      {message}
    </p>
  );
}

export default function BoxEditor() {
  const { shareId } = useParams();
  const isEdit = Boolean(shareId);
  const existing = useQuery(
    api.boxes.getForEdit,
    isEdit ? { shareId: shareId! } : "skip",
  );
  const initialBox = useMemo(
    () => (existing ? draftFromBox(existing) : null),
    [existing],
  );

  if (isEdit && existing === undefined) {
    return <EditorLoading label="Opening your box…" />;
  }

  if (isEdit && existing === null) {
    return <BoxNotEditable />;
  }

  return (
    <BoxEditorForm
      key={shareId ?? "new-box"}
      shareId={shareId}
      isEdit={isEdit}
      initialBox={initialBox}
    />
  );
}

function EditorLoading({ label }: { label: string }) {
  return (
    <SiteLayout minimalHeader>
      <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl items-center justify-center px-5">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {label}
        </div>
      </div>
    </SiteLayout>
  );
}

function BoxNotEditable() {
  return (
    <SiteLayout minimalHeader>
      <div className="mx-auto w-full max-w-xl px-5 py-24 text-center">
        <p className="eyebrow">Not your box to edit</p>
        <h1 className="mt-4 font-serif text-3xl">
          This box isn't in your account.
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          It may have been deleted, or it belongs to a different sign-in.
          Recipient links can't be used to edit a box.
        </p>
        <Button asChild className="mt-7 rounded-full px-5">
          <Link to="/dashboard">Back to my boxes</Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function BoxEditorForm({
  isEdit,
  shareId,
  initialBox,
}: {
  isEdit: boolean;
  shareId: string | undefined;
  initialBox: BoxDraft | null;
}) {
  const navigate = useNavigate();
  const createBox = useMutation(api.boxes.create);
  const updateBox = useMutation(api.boxes.update);
  const convex = useConvex();

  const [restoredDraft] = useState<BoxDraft | null>(() =>
    isEdit ? null : loadStoredDraft(),
  );
  const [showRestoredBanner, setShowRestoredBanner] = useState(() =>
    Boolean(restoredDraft && hasDraftContent(restoredDraft)),
  );
  const [baseline] = useState(() =>
    initialBox ? JSON.stringify(initialBox) : "",
  );
  const [draft, setDraft] = useState<BoxDraft>(
    () => initialBox ?? restoredDraft ?? EMPTY_DRAFT,
  );
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [editor, setEditor] = useState<{
    open: boolean;
    envelope: DraftEnvelope | null;
  }>({ open: false, envelope: null });
  const [viewer, setViewer] = useState<DraftEnvelope | null>(null);

  const reduceMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
  };

  // A restored draft may only have blob: previews from the last session.
  // Resolve those back to their stored files so photos still show.
  useEffect(() => {
    if (isEdit || !restoredDraft) return;
    const pending = new Set<string>();
    for (const envelope of restoredDraft.envelopes) {
      for (const block of envelope.blocks) {
        if (
          (block.type === "image" || block.type === "memory") &&
          block.storageId &&
          (!block.previewUrl || block.previewUrl.startsWith("blob:"))
        ) {
          pending.add(block.storageId);
        }
      }
    }
    if (pending.size === 0) return;

    let cancelled = false;
    void (async () => {
      const urls = new Map<string, string>();
      for (const storageId of pending) {
        try {
          const url = await convex.query(api.boxes.uploadUrl, {
            storageId: storageId as Id<"_storage">,
          });
          if (url) urls.set(storageId, url);
        } catch (error) {
          console.warn("[Open When] Could not restore a draft photo", error);
        }
      }
      if (cancelled || urls.size === 0) return;
      setDraft((current) => ({
        ...current,
        envelopes: current.envelopes.map((envelope) => ({
          ...envelope,
          blocks: envelope.blocks.map((block) => {
            if (
              (block.type === "image" || block.type === "memory") &&
              block.storageId &&
              urls.has(block.storageId)
            ) {
              return { ...block, previewUrl: urls.get(block.storageId)! };
            }
            return block;
          }),
        })),
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [convex, isEdit, restoredDraft]);

  // Keep an unsaved draft in this browser while making a new box.
  useEffect(() => {
    if (isEdit) return;
    if (!hasDraftContent(draft)) {
      clearStoredDraft();
      return;
    }
    const timeout = window.setTimeout(() => storeDraft(draft), 600);
    return () => window.clearTimeout(timeout);
  }, [draft, isEdit]);

  const dirty = useMemo(() => {
    if (isEdit) return JSON.stringify(draft) !== baseline;
    return hasDraftContent(draft);
  }, [baseline, draft, isEdit]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const previewCount = draft.envelopes.length;

  function goTo(index: number) {
    setStep(index);
    setMaxStep((current) => Math.max(current, index));
    setErrors({});
    scrollToTop();
  }

  function handleContinue() {
    const found = validateStep(step, draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      toast.error(Object.values(found)[0]);
      return;
    }
    goTo(step + 1);
  }

  function handleBack() {
    setStep((current) => Math.max(0, current - 1));
    setErrors({});
    scrollToTop();
  }

  function updateDraft(patch: Partial<BoxDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setErrors({});
  }

  function handleSaveEnvelope(envelope: DraftEnvelope) {
    const exists = draft.envelopes.some((entry) => entry.id === envelope.id);
    setDraft((current) => {
      const isExisting = current.envelopes.some(
        (entry) => entry.id === envelope.id,
      );
      return {
        ...current,
        envelopes: isExisting
          ? current.envelopes.map((entry) =>
              entry.id === envelope.id ? envelope : entry,
            )
          : [...current.envelopes, envelope],
      };
    });
    setErrors({});
    toast.success(exists ? "Envelope updated." : "Envelope added.");
  }

  function handleDuplicateEnvelope(envelope: DraftEnvelope) {
    const copy: DraftEnvelope = {
      ...envelope,
      id: newId(),
      blocks: envelope.blocks.map((block) => ({ ...block, id: newId() })),
    };
    setDraft((current) => {
      const index = current.envelopes.findIndex(
        (entry) => entry.id === envelope.id,
      );
      const envelopes = [...current.envelopes];
      envelopes.splice(index + 1, 0, copy);
      return { ...current, envelopes };
    });
    toast.success("Envelope duplicated.");
  }

  function handleDeleteEnvelope(envelope: DraftEnvelope) {
    const index = draft.envelopes.findIndex(
      (entry) => entry.id === envelope.id,
    );
    if (index < 0) return;
    setDraft((current) => ({
      ...current,
      envelopes: current.envelopes.filter((entry) => entry.id !== envelope.id),
    }));
    toast("Envelope removed.", {
      action: {
        label: "Undo",
        onClick: () => {
          setDraft((current) => {
            const envelopes = [...current.envelopes];
            envelopes.splice(Math.min(index, envelopes.length), 0, envelope);
            return { ...current, envelopes };
          });
        },
      },
    });
  }

  function handleMoveEnvelope(id: string, direction: -1 | 1) {
    setDraft((current) => {
      const index = current.envelopes.findIndex((entry) => entry.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.envelopes.length) {
        return current;
      }
      const envelopes = [...current.envelopes];
      const [moved] = envelopes.splice(index, 1);
      envelopes.splice(target, 0, moved);
      return { ...current, envelopes };
    });
  }

  function openEnvelopeEditor(envelope: DraftEnvelope | null) {
    setEditor({ open: true, envelope });
  }

  function addFromTemplate(template: { title: string; hint: string }) {
    openEnvelopeEditor({
      id: newId(),
      title: template.title,
      hint: template.hint,
      blocks: [],
    });
  }

  function startFresh() {
    clearStoredDraft();
    setDraft(EMPTY_DRAFT);
    setStep(0);
    setMaxStep(0);
    setShowRestoredBanner(false);
    setErrors({});
    toast.success("Starting with a clean box.");
  }

  async function handleSave() {
    const found = {
      ...validateStep(0, draft),
      ...validateStep(2, draft),
    };
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStep(found.title || found.recipientName || found.senderName ? 0 : 2);
      setMaxStep((current) => Math.max(current, 2));
      toast.error(Object.values(found)[0]);
      scrollToTop();
      return;
    }

    setSaving(true);
    setSaveError(null);
    try {
      const fields = {
        title: draft.title.trim(),
        subtitle: draft.subtitle.trim() || undefined,
        recipientName: draft.recipientName.trim(),
        senderName: draft.senderName.trim(),
        introduction: draft.introduction.trim() || undefined,
        theme: draft.theme,
        envelopes: draftToPayloadEnvelopes(draft),
      };
      const result = isEdit
        ? await updateBox({ shareId: shareId!, ...fields })
        : await createBox(fields);
      clearStoredDraft();
      navigate(
        `/box/${result.shareId}/share?${isEdit ? "updated=1" : "created=1"}`,
      );
    } catch (error) {
      console.error("[Open When] Could not save box", error);
      setSaveError(readableSaveError(error));
    } finally {
      setSaving(false);
    }
  }

  const viewingIndex = viewer
    ? Math.max(
        draft.envelopes.findIndex((entry) => entry.id === viewer.id),
        0,
      )
    : 0;

  return (
    <SiteLayout minimalHeader>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to={isEdit ? "/dashboard" : "/"}
            onClick={(event) => {
              if (
                isEdit &&
                dirty &&
                !window.confirm(
                  "You have unsaved changes. Leave without saving them?",
                )
              ) {
                event.preventDefault();
              }
            }}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {isEdit ? "My boxes" : "Home"}
          </Link>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
            {isEdit
              ? dirty
                ? "Unsaved changes"
                : "All changes saved"
              : "Draft kept in this browser"}
          </p>
        </div>

        <div className="mt-7">
          <p className="eyebrow">{isEdit ? "Editing a box" : "A new box"}</p>
          <h1 className="mt-2.5 font-serif text-[clamp(2rem,4.6vw,3rem)] leading-[1.05]">
            {isEdit
              ? "Change a little something."
              : "Make something for someone."}
          </h1>
        </div>

        <StepIndicator
          steps={STEPS}
          current={step}
          maxReached={maxStep}
          onSelect={goTo}
        />

        {showRestoredBanner && step === 0 && (
          <div className="mt-6 flex flex-col gap-3 rounded-[3px] border border-border bg-card/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              We kept the draft you started earlier in this browser.
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={startFresh}
              className="self-start rounded-full text-[12px]"
            >
              Start fresh
            </Button>
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
          <section className="paper-card overflow-hidden rounded-sm">
            <div className="flex flex-col gap-1 border-b border-border px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
              <h2 className="font-serif text-[20px]">
                {STEP_HEADINGS[step].title}
              </h2>
              <p className="text-[12px] text-muted-foreground">
                {STEP_HEADINGS[step].hint}
              </p>
            </div>

            <div className="px-5 py-6 sm:px-8 sm:py-8">
              {step === 0 && (
                <div className="space-y-7">
                  <div className="space-y-2">
                    <Label htmlFor="box-title" className="text-[12px]">
                      Box name
                    </Label>
                    <Input
                      id="box-title"
                      value={draft.title}
                      maxLength={90}
                      placeholder="A Little Something for You"
                      onChange={(event) =>
                        updateDraft({ title: event.target.value })
                      }
                      aria-invalid={Boolean(errors.title)}
                      aria-describedby={
                        errors.title ? "box-title-error" : undefined
                      }
                      className="h-10 bg-background/60"
                    />
                    <FieldError id="box-title-error" message={errors.title} />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-1">
                      <span className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/80">
                        Try
                      </span>
                      {BOX_NAME_IDEAS.map((idea) => (
                        <button
                          key={idea}
                          type="button"
                          onClick={() => updateDraft({ title: idea })}
                          className="rounded-full border border-transparent px-2 py-1 text-[11.5px] text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:border-border hover:text-foreground"
                        >
                          {idea}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="box-recipient" className="text-[12px]">
                        Who is it for?
                      </Label>
                      <Input
                        id="box-recipient"
                        value={draft.recipientName}
                        maxLength={60}
                        placeholder="Alex"
                        onChange={(event) =>
                          updateDraft({ recipientName: event.target.value })
                        }
                        aria-invalid={Boolean(errors.recipientName)}
                        aria-describedby={
                          errors.recipientName
                            ? "box-recipient-error"
                            : undefined
                        }
                        className="h-10 bg-background/60"
                      />
                      <FieldError
                        id="box-recipient-error"
                        message={errors.recipientName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="box-sender" className="text-[12px]">
                        From
                      </Label>
                      <Input
                        id="box-sender"
                        value={draft.senderName}
                        maxLength={60}
                        placeholder="Jamie"
                        onChange={(event) =>
                          updateDraft({ senderName: event.target.value })
                        }
                        aria-invalid={Boolean(errors.senderName)}
                        aria-describedby={
                          errors.senderName ? "box-sender-error" : undefined
                        }
                        className="h-10 bg-background/60"
                      />
                      <FieldError
                        id="box-sender-error"
                        message={errors.senderName}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="box-introduction" className="text-[12px]">
                      An introduction{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="box-introduction"
                      value={draft.introduction}
                      maxLength={1500}
                      rows={5}
                      placeholder="I made this little box for you. You don't have to open everything at once. Save each envelope for when it feels right."
                      onChange={(event) =>
                        updateDraft({ introduction: event.target.value })
                      }
                      className="resize-y bg-background/60 font-serif text-[14.5px] leading-[1.8]"
                    />
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        This appears on the cover, just before the envelopes.
                      </p>
                      <span className="shrink-0 text-[10.5px] tabular-nums text-muted-foreground">
                        {draft.introduction.length}/1500
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-7">
                  <div>
                    <p className="text-[12px] font-medium">Cover theme</p>
                    <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                      It changes the paper, not the words. You can change it
                      whenever you like.
                    </p>
                    <div className="mt-3.5">
                      <ThemePicker
                        value={draft.theme}
                        onChange={(theme) => updateDraft({ theme })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="box-subtitle" className="text-[12px]">
                      A subtitle{" "}
                      <span className="font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="box-subtitle"
                      value={draft.subtitle}
                      maxLength={120}
                      placeholder="For the days that need a little help."
                      onChange={(event) =>
                        updateDraft({ subtitle: event.target.value })
                      }
                      className="h-10 bg-background/60"
                    />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Sits under the box name on the cover.
                    </p>
                  </div>

                  <div className="rounded-[3px] border border-border bg-background/40 p-4">
                    <p className="eyebrow">A live look</p>
                    <div className="mt-3">
                      <BoxCover
                        theme={draft.theme}
                        title={draft.title}
                        subtitle={draft.subtitle}
                        recipientName={draft.recipientName}
                        senderName={draft.senderName}
                        introduction={draft.introduction}
                        envelopeCount={previewCount}
                        variant="compact"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[13px] text-muted-foreground">
                      {previewCount}{" "}
                      {previewCount === 1 ? "envelope" : "envelopes"} so far
                    </p>
                    <Button
                      type="button"
                      onClick={() => openEnvelopeEditor(null)}
                      className="rounded-full px-4 text-[12.5px]"
                    >
                      <Plus className="size-3.5" aria-hidden="true" />
                      Add an envelope
                    </Button>
                  </div>

                  {errors.envelopes && (
                    <p
                      role="alert"
                      tabIndex={-1}
                      id="envelope-list"
                      className="rounded-[3px] border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-destructive"
                    >
                      {errors.envelopes}
                    </p>
                  )}

                  {previewCount === 0 ? (
                    <div className="rounded-[3px] border border-dashed border-input bg-card/40 px-6 py-12 text-center">
                      <p className="font-serif text-[20px]">
                        No envelopes yet.
                      </p>
                      <p className="mx-auto mt-2 max-w-xs text-[12.5px] leading-relaxed text-muted-foreground">
                        Start with a title you know they'll need, then fill it
                        with something only you could send.
                      </p>
                      <Button
                        type="button"
                        onClick={() => openEnvelopeEditor(null)}
                        variant="outline"
                        className="mt-5 rounded-full bg-transparent px-5 text-[12.5px]"
                      >
                        <Plus className="size-3.5" aria-hidden="true" />
                        Write the first one
                      </Button>
                    </div>
                  ) : (
                    <EnvelopeList
                      envelopes={draft.envelopes}
                      onEdit={(envelope) => openEnvelopeEditor(envelope)}
                      onDuplicate={handleDuplicateEnvelope}
                      onDelete={handleDeleteEnvelope}
                      onMove={handleMoveEnvelope}
                      onPreview={(envelope) => setViewer(envelope)}
                    />
                  )}

                  <div className="rounded-[3px] border border-border bg-background/40 p-4">
                    <p className="eyebrow">Or start from a title</p>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                      These only fill in the title and a small hint. You'll
                      write the actual message.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(showAllTemplates
                        ? ENVELOPE_TEMPLATES
                        : ENVELOPE_TEMPLATES.slice(0, 6)
                      ).map((template) => (
                        <button
                          key={template.title}
                          type="button"
                          onClick={() => addFromTemplate(template)}
                          className="rounded-full border border-border bg-card px-3 py-1.5 text-[11.5px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                        >
                          {template.title}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setShowAllTemplates((current) => !current)
                        }
                        className="rounded-full px-2.5 py-1.5 text-[11.5px] text-muted-foreground underline decoration-border underline-offset-2 hover:text-foreground"
                      >
                        {showAllTemplates ? "Fewer titles" : "More titles"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-7">
                  <div className="rounded-[3px] border border-border bg-background/40 px-4 py-3">
                    <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                      {isEdit ? (
                        <>
                          This is what {draft.recipientName || "they"} sees
                          right now. Saving updates this same link — it won't
                          change.
                        </>
                      ) : (
                        <>
                          This is exactly what {draft.recipientName || "they"}{" "}
                          will see. Nothing is saved yet, so you can still
                          change everything.
                        </>
                      )}
                    </p>
                  </div>

                  <BoxCover
                    theme={draft.theme}
                    title={draft.title}
                    subtitle={draft.subtitle}
                    recipientName={draft.recipientName}
                    senderName={draft.senderName}
                    introduction={draft.introduction}
                    envelopeCount={previewCount}
                  />

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
                      <p className="eyebrow">The envelopes</p>
                      <p className="text-[11px] text-muted-foreground">
                        Tap one to preview what's inside
                      </p>
                    </div>
                    {previewCount === 0 ? (
                      <p className="mt-4 text-[13px] text-muted-foreground">
                        There are no envelopes in this box yet.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {draft.envelopes.map((envelope, index) => (
                          <EnvelopeCard
                            key={envelope.id}
                            theme={THEMES[draft.theme]}
                            title={envelope.title}
                            hint={envelope.hint}
                            index={index}
                            onOpen={() => setViewer(envelope)}
                          />
                        ))}
                      </div>
                    )}
                    <p className="mt-4 text-[11.5px] leading-relaxed text-muted-foreground">
                      Every envelope is ready to open straight away. The titles
                      are prompts — the person receiving it decides when each
                      one feels right.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo(0)}
                      className="rounded-full bg-transparent text-[12px]"
                    >
                      Edit the details
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo(1)}
                      className="rounded-full bg-transparent text-[12px]"
                    >
                      Change the cover
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo(2)}
                      className="rounded-full bg-transparent text-[12px]"
                    >
                      Edit envelopes
                    </Button>
                    {isEdit && (
                      <Button
                        asChild
                        variant="ghost"
                        className="rounded-full text-[12px]"
                      >
                        {" "}
                        <Link to={`/preview/${shareId}`}>
                          Open full preview
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border bg-card/60 px-5 py-4 sm:px-8">
              {saveError && (
                <p
                  role="alert"
                  className="mb-3 rounded-[3px] border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-destructive"
                >
                  {saveError}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 0 || saving}
                  className="rounded-full text-[12.5px]"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Back
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleContinue}
                    className="rounded-full px-5 text-[12.5px]"
                  >
                    Continue
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-full px-5 text-[12.5px]"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          className="size-3.5 animate-spin"
                          aria-hidden="true"
                        />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5" aria-hidden="true" />
                        {isEdit ? "Save changes" : "Save & get the link"}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </section>

          <aside className="hidden space-y-4 lg:block">
            <div className="flex items-baseline justify-between gap-2">
              <p className="eyebrow">A live look</p>
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                {previewCount} {previewCount === 1 ? "envelope" : "envelopes"}
              </span>
            </div>
            <BoxCover
              theme={draft.theme}
              title={draft.title}
              subtitle={draft.subtitle}
              recipientName={draft.recipientName}
              senderName={draft.senderName}
              introduction={draft.introduction}
              envelopeCount={previewCount}
              variant="compact"
            />
            <p className="text-[11.5px] leading-relaxed text-muted-foreground">
              {step === 0
                ? "The names and the note appear on the cover. You can change all of it later."
                : step === 1
                  ? "The cover is just the wrapping. The envelopes are the gift."
                  : step === 2
                    ? "A good hint makes it easier to choose which envelope to open."
                    : "Saving gives you one private link to send."}
            </p>
            <div className="border-t border-border pt-4">
              <p className="eyebrow text-[9.5px]">A small tip</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
                Four to eight envelopes is a lovely amount. Enough to feel like
                a gift, not so many that it becomes homework.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {editor.open && (
        <EnvelopeEditor
          key={editor.envelope?.id ?? "new-envelope"}
          open
          onOpenChange={(open) =>
            setEditor((current) => ({ ...current, open }))
          }
          initial={editor.envelope}
          onSave={handleSaveEnvelope}
        />
      )}

      {viewer && (
        <EnvelopeViewer
          key={viewer.id}
          title={viewer.title || "An envelope"}
          index={viewingIndex}
          theme={draft.theme}
          senderName={draft.senderName || "you"}
          recipientName={draft.recipientName || undefined}
          blocks={blocksFromDraft(viewer.blocks)}
          onClose={() => setViewer(null)}
        />
      )}
    </SiteLayout>
  );
}
