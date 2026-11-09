import { BoxExperience } from "@/components/BoxExperience";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

export default function RecipientBox() {
  const { shareId } = useParams();
  const box = useQuery(api.boxes.getPublic, shareId ? { shareId } : "skip");

  // Boxes are private link-only pages: keep them out of search results.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    if (box?.title) {
      document.title = `${box.title} — Open When`;
    }
    return () => {
      document.title =
        "Open When — a little something, for whenever you need it";
    };
  }, [box?.title]);

  if (box === undefined) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-5">
          <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Finding your box…
          </div>
        </div>
      </div>
    );
  }

  if (box === null) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-2xl px-5 py-24 text-center sm:py-32">
          <p className="eyebrow">A missing envelope</p>
          <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.08]">
            This little surprise couldn't be found.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[14.5px] leading-[1.8] text-muted-foreground">
            The link may be incomplete, or the box may have been deleted by the
            person who made it. If someone sent it to you, it's worth asking
            them for the link again.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button asChild className="h-11 rounded-full px-6">
              <Link to="/">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back home
              </Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return <BoxExperience box={box} />;
}
