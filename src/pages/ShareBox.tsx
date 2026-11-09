import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { boxShareUrl, copyText } from "@/lib/box";
import { useQuery } from "convex/react";
import {
  Check,
  Copy,
  ExternalLink,
  Eye,
  LayoutGrid,
  Loader2,
  Pencil,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function ShareBox() {
  const { shareId } = useParams();
  const [searchParams] = useSearchParams();
  const box = useQuery(api.boxes.getForEdit, shareId ? { shareId } : "skip");
  const [copied, setCopied] = useState(false);
  const created = searchParams.get("created") === "1";
  const updated = searchParams.get("updated") === "1";
  const link = shareId ? boxShareUrl(shareId) : "";
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    const success = await copyText(link);
    if (success) {
      setCopied(true);
      toast.success("Link copied!");
    } else {
      toast.error(
        "Couldn't copy the link automatically. You can select the address and copy it.",
      );
    }
  }

  async function handleNativeShare() {
    if (!box) return;
    try {
      await navigator.share({
        title: box.title,
        text: `A little something for ${box.recipientName}.`,
        url: link,
      });
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") {
        toast.error("Sharing didn't open. You can copy the link instead.");
      }
    }
  }

  if (box === undefined) {
    return (
      <SiteLayout minimalHeader>
        <div className="flex min-h-[50vh] items-center justify-center gap-2 px-5 text-[13px] text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Getting your link ready…
        </div>
      </SiteLayout>
    );
  }

  if (box === null) {
    return (
      <SiteLayout minimalHeader>
        <div className="mx-auto w-full max-w-xl px-5 py-24 text-center">
          <p className="eyebrow">Link unavailable</p>
          <h1 className="mt-4 font-serif text-3xl">
            This box isn't in your account.
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Only the person who made a box can see its sharing page.
          </p>
          <Button asChild className="mt-7 rounded-full px-5">
            <Link to="/dashboard">Back to my boxes</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout minimalHeader>
      <div className="mx-auto w-full max-w-2xl px-5 py-14 sm:py-20">
        <p className="eyebrow">
          {created ? "Saved" : updated ? "Updated" : "Share your box"}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.06] text-balance">
          {created
            ? "Your little surprise is ready."
            : updated
              ? "Your changes are in."
              : "Send it when you're ready."}
        </h1>
        <p className="mt-4 max-w-lg text-[14.5px] leading-[1.8] text-muted-foreground">
          {created
            ? `Share this link with ${box.recipientName}. They can open their envelopes whenever the moment feels right.`
            : updated
              ? "The box is saved. Its link hasn't changed, so anything you already sent still works."
              : "Anyone with this link can open the box. It stays the same even if you edit the envelopes later."}
        </p>

        <section className="paper-card mt-9 rounded-sm p-5 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <div>
              <p className="eyebrow">The box</p>
              <h2 className="mt-2 font-serif text-[22px] leading-snug">
                {box.title}
              </h2>
            </div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              For {box.recipientName} · {box.envelopes.length}{" "}
              {box.envelopes.length === 1 ? "envelope" : "envelopes"}
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="share-link"
              className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
            >
              Recipient link
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Input
                id="share-link"
                readOnly
                value={link}
                onFocus={(event) => event.currentTarget.select()}
                className="h-10 flex-1 bg-background/60 font-mono text-[12px]"
              />
              <Button
                type="button"
                onClick={() => void handleCopy()}
                className="h-10 shrink-0 rounded-full px-4 text-[12.5px]"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden="true" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
            <span role="status" className="sr-only">
              {copied ? "Link copied to clipboard" : ""}
            </span>
            {canNativeShare && (
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleNativeShare()}
                className="mt-2.5 h-9 w-full rounded-full bg-transparent text-[12px] sm:hidden"
              >
                <Share2 className="size-3.5" aria-hidden="true" />
                Share from this device
              </Button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-full bg-transparent text-[12px]"
            >
              <Link to={`/preview/${box.shareId}`}>
                <Eye className="size-3.5" aria-hidden="true" />
                Preview box
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-9 rounded-full bg-transparent text-[12px]"
            >
              <a
                href={`/box/${box.shareId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" />
                Open the link
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-9 rounded-full text-[12px]"
            >
              <Link to={`/box/${box.shareId}/edit`}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-9 rounded-full text-[12px]"
            >
              <Link to="/dashboard">
                <LayoutGrid className="size-3.5" aria-hidden="true" />
                My boxes
              </Link>
            </Button>
          </div>
        </section>

        <div className="mt-8 border-l border-border pl-5">
          <p className="eyebrow">A small note on privacy</p>
          <p className="mt-2.5 text-[12.5px] leading-[1.8] text-muted-foreground">
            The link is the only key. Anyone who has it can open the box, so
            it's best sent just to the person it's for. There's no password on a
            box in this version.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
