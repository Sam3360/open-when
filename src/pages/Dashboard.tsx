import { SiteLayout } from "@/components/SiteLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { boxShareUrl, copyText } from "@/lib/box";
import { THEMES, themeVars, type ThemeKey } from "@/lib/themes";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import {
  Copy,
  Eye,
  LayoutGrid,
  Link2,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

type DashboardBox = {
  shareId: string;
  title: string;
  subtitle: string | null;
  recipientName: string;
  senderName: string;
  theme: ThemeKey;
  createdAt: number;
  envelopeCount: number;
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const boxes = useQuery(api.boxes.listMine);

  async function handleCopy(box: DashboardBox) {
    const success = await copyText(boxShareUrl(box.shareId));
    if (success) {
      toast.success("Link copied!");
    } else {
      toast.error(
        "Couldn't copy the link. Open the sharing page and copy the address.",
      );
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">My boxes</p>
            <h1 className="mt-3 font-serif text-[clamp(2rem,4.6vw,2.9rem)] leading-[1.05]">
              Your little surprises.
            </h1>
            <p className="mt-3 max-w-md text-[14px] leading-[1.8] text-muted-foreground">
              Everything here is waiting quietly. Share a link again, or change
              what's inside.
            </p>
          </div>
          <Button asChild className="self-start rounded-full px-5 sm:self-auto">
            <Link to="/create">
              <Plus className="size-4" aria-hidden="true" />
              Create a box
            </Link>
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border/80 py-3">
          <span className="flex min-w-0 items-center gap-1.5 text-[11.5px] text-muted-foreground">
            <Mail className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {user?.email ?? (user?.isAnonymous ? "Guest" : "Signed in")}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="hidden h-3 w-px bg-border sm:block"
          />
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="size-3" aria-hidden="true" />
            Sign out
          </button>
        </div>

        {user?.isAnonymous && (
          <div className="mt-5 rounded-[3px] border border-border bg-card/60 px-4 py-3">
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                You're browsing as a guest.
              </span>{" "}
              Your boxes stay tied to this browser. Signing in with an email
              code is what keeps them reachable from another device.
            </p>
          </div>
        )}

        {boxes === undefined ? (
          <div className="mt-12 flex items-center justify-center gap-2 py-16 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Gathering your boxes…
          </div>
        ) : boxes.length === 0 ? (
          <div className="mt-12 rounded-[3px] border border-dashed border-input bg-card/40 px-6 py-16 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-background/70">
              <LayoutGrid
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <h2 className="mt-5 font-serif text-[24px] leading-snug">
              You haven't made a little surprise yet.
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
              Create something thoughtful for someone you care about. It takes
              about as long as writing a good letter.
            </p>
            <Button asChild className="mt-6 rounded-full px-5">
              <Link to="/create">
                <Plus className="size-4" aria-hidden="true" />
                Create your first box
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {boxes.map((box) => (
              <DashboardBoxCard
                key={box.shareId}
                box={box}
                onCopy={() => void handleCopy(box)}
              />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function DashboardBoxCard({
  box,
  onCopy,
}: {
  box: DashboardBox;
  onCopy: () => void;
}) {
  const palette = THEMES[box.theme];

  return (
    <article className="paper-card flex flex-col overflow-hidden rounded-sm">
      <div
        className="relative overflow-hidden px-5 pb-5 pt-6"
        style={{
          ...themeVars(palette),
          backgroundColor: palette.cover.bg,
          color: palette.cover.ink,
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-45"
          style={{
            background: `linear-gradient(180deg, ${palette.cover.line}, ${palette.cover.bg})`,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        />
        <div className="relative">
          <p
            className="eyebrow text-[9.5px]"
            style={{ color: palette.cover.soft }}
          >
            For {box.recipientName}
          </p>
          <h2 className="mt-2.5 line-clamp-2 break-words font-serif text-[21px] leading-[1.18]">
            {box.title}
          </h2>
          {box.subtitle ? (
            <p
              className="mt-1.5 line-clamp-1 font-serif text-[13px] italic"
              style={{ color: palette.cover.soft }}
            >
              {box.subtitle}
            </p>
          ) : null}
          <div
            className="mt-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t pt-3 text-[10px] uppercase tracking-[0.14em]"
            style={{
              borderColor: palette.cover.line,
              color: palette.cover.soft,
            }}
          >
            <span>
              {box.envelopeCount}{" "}
              {box.envelopeCount === 1 ? "envelope" : "envelopes"}
            </span>
            <span>{format(new Date(box.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-t border-border px-2.5 py-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full px-2.5 text-[11.5px]"
        >
          <Link to={`/box/${box.shareId}/share`}>
            <Link2 className="size-3.5" aria-hidden="true" />
            Share
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full px-2.5 text-[11.5px]"
        >
          <Link to={`/preview/${box.shareId}`}>
            <Eye className="size-3.5" aria-hidden="true" />
            Preview
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full px-2.5 text-[11.5px]"
        >
          <Link to={`/box/${box.shareId}/edit`}>
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onCopy}
          aria-label={`Copy recipient link for “${box.title}”`}
          className="rounded-full"
        >
          <Copy className="size-3.5" aria-hidden="true" />
        </Button>
        <div className="ml-auto">
          <DeleteBoxDialog box={box} />
        </div>
      </div>
    </article>
  );
}

function DeleteBoxDialog({ box }: { box: DashboardBox }) {
  const removeBox = useMutation(api.boxes.remove);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDeleting(true);
    try {
      await removeBox({ shareId: box.shareId });
      setOpen(false);
      toast.success("Box deleted.");
    } catch (error) {
      console.error("[Open When] Could not delete box", error);
      toast.error("We couldn't delete the box just now. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete “${box.title}”`}
          className="rounded-full text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="paper-card">
        <AlertDialogHeader>
          <p className="eyebrow">Before it goes</p>
          <AlertDialogTitle className="font-serif text-2xl">
            Delete “{box.title}”?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] leading-relaxed">
            The recipient link will stop working, and every envelope and photo
            inside will be removed. This can't be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Keep it</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Deleting…
              </>
            ) : (
              "Delete box"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
