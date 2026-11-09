import { BoxExperience } from "@/components/BoxExperience";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLeft, Loader2, Share2 } from "lucide-react";
import { Link, useParams } from "react-router";

export default function PreviewBox() {
  const { shareId } = useParams();
  const box = useQuery(api.boxes.getForEdit, shareId ? { shareId } : "skip");

  if (box === undefined) {
    return (
      <SiteLayout minimalHeader>
        <div className="flex min-h-[50vh] items-center justify-center px-5">
          <Loader2
            className="size-5 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Loading preview</span>
        </div>
      </SiteLayout>
    );
  }

  if (box === null) {
    return (
      <SiteLayout minimalHeader>
        <div className="mx-auto w-full max-w-xl px-5 py-24 text-center">
          <p className="eyebrow">Preview unavailable</p>
          <h1 className="mt-4 font-serif text-3xl">
            This box isn't in your account.
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            You can only preview boxes you made while signed in.
          </p>
          <Button asChild className="mt-7 rounded-full px-5">
            <Link to="/dashboard">Back to my boxes</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-border bg-foreground text-background">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-2.5 sm:px-8">
          <p className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em]">
            <span
              className="inline-block size-1.5 rounded-full bg-background"
              aria-hidden="true"
            />
            Preview mode · this is what {box.recipientName} sees
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="rounded-full text-[11.5px] text-background hover:bg-background/15 hover:text-background"
            >
              <Link to={`/box/${box.shareId}/edit`}>
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Back to editing
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="rounded-full text-[11.5px] text-background hover:bg-background/15 hover:text-background"
            >
              <Link to={`/box/${box.shareId}/share`}>
                <Share2 className="size-3.5" aria-hidden="true" />
                Share
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <BoxExperience box={box} />
    </div>
  );
}
