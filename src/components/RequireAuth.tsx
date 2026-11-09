import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Lock } from "lucide-react";
import type { ReactNode } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";

/**
 * Wraps a route that requires a signed-in user. Signed-out visitors are told
 * what they were trying to reach, and sign-in returns them to it.
 */
export function RequireAuth({
  children,
  title = "Sign in to continue",
  description = "This page is only available to signed-in users.",
  redirectImmediately = false,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  redirectImmediately?: boolean;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2
          className="size-5 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">Loading</span>
      </main>
    );
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    const signInHref = `/auth?returnTo=${encodeURIComponent(returnTo)}`;

    if (redirectImmediately) {
      return <Navigate to={signInHref} replace />;
    }

    return (
      <main className="flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-6xl items-center px-5 py-6 sm:px-8">
          <Link
            to="/"
            aria-label="Open When — home"
            className="text-foreground transition-opacity hover:opacity-70"
          >
            <Wordmark />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-20">
          <div className="paper-card w-full max-w-md rounded-sm p-7 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-full border border-border bg-background/60">
              <Lock
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
            <h1 className="mt-6 font-serif text-2xl leading-tight">{title}</h1>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
              {description}
            </p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
              You'll come straight back to this page once you're signed in.
            </p>
            <div className="mt-7 flex flex-col gap-2">
              <Button
                onClick={() => navigate(signInHref)}
                className="h-10 w-full rounded-full text-[13px]"
              >
                Sign in
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="h-9 w-full rounded-full text-[12.5px]"
              >
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return children;
}
