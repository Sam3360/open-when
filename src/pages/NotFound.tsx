import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MailOpen } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-24 text-center sm:py-32">
        <span className="flex size-16 items-center justify-center rounded-full border border-border bg-card">
          <MailOpen
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        </span>
        <p className="eyebrow mt-8">A missing envelope</p>
        <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] leading-[1.08]">
          This little surprise couldn't be found.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-muted-foreground">
          The link may be incomplete, or the box may have been deleted by the
          person who made it. If someone sent it to you, it's worth asking them
          for the link again.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-11 rounded-full px-6">
            <Link to="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back home
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-full px-6">
            <Link to="/create">
              Make a box
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
