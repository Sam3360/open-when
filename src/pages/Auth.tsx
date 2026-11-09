import { EnvelopeCard } from "@/components/EnvelopeCard";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { THEMES } from "@/lib/themes";
import { ArrowRight, Loader2, Mail, UserRound } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
    } catch (signInError) {
      console.error("Email sign-in error:", signInError);
      setError(
        "We couldn't send the code just now. Check the address and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (verifyError) {
      console.error("OTP verification error:", verifyError);
      setError("That code didn't work. Have another look and try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (guestError) {
      console.error("Guest sign-in error:", guestError);
      setError("We couldn't start a guest session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
      <aside className="relative hidden flex-col justify-between border-r border-border bg-card/40 px-10 py-10 lg:flex">
        <Link
          to="/"
          aria-label="Open When — home"
          className="w-fit text-foreground transition-opacity hover:opacity-70"
        >
          <Wordmark />
        </Link>

        <div className="max-w-md">
          <p className="eyebrow">Before you begin</p>
          <p className="mt-4 font-serif text-[clamp(1.9rem,2.7vw,2.5rem)] italic leading-[1.25]">
            “A little something, for whenever they need it.”
          </p>
          <p className="mt-6 text-[13.5px] leading-[1.85] text-muted-foreground">
            Make a box of envelopes for someone you like. You'll get one link to
            send. They won't need an account, and nothing is listed publicly.
          </p>
        </div>

        <div className="max-w-sm">
          <div className="w-[86%] -rotate-2">
            <EnvelopeCard
              theme={THEMES.lavender}
              title="Open when you need a little encouragement"
              hint="You're doing better than you think."
              index={0}
            />
          </div>
          <p className="mt-4 font-serif text-[12px] italic text-muted-foreground">
            An envelope from your box.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden">
            <Link
              to="/"
              aria-label="Open When — home"
              className="inline-block text-foreground"
            >
              <Wordmark />
            </Link>
          </div>

          <p className="eyebrow mt-10 lg:mt-0">
            {step === "signIn" ? "Your account" : "One more step"}
          </p>
          <h1 className="mt-3 font-serif text-[clamp(1.9rem,4vw,2.4rem)] leading-[1.1]">
            {step === "signIn" ? "Sign in to make a box." : "Check your email."}
          </h1>
          <p className="mt-3 text-[13px] leading-[1.8] text-muted-foreground">
            {step === "signIn"
              ? "A six-digit code keeps it simple. No password to remember."
              : `We sent a code to ${step.email}. It's good for 15 minutes.`}
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-[3px] border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-destructive"
            >
              {error}
            </p>
          )}

          {step === "signIn" ? (
            <>
              <form onSubmit={handleEmailSubmit} className="mt-7 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[12px]">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className="h-10 bg-background/60 pl-9"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-10 w-full rounded-full text-[13px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Sending the code…
                    </>
                  ) : (
                    <>
                      Email me a code
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => void handleGuestLogin()}
                disabled={isLoading}
                className="h-10 w-full rounded-full bg-transparent text-[13px]"
              >
                <UserRound className="size-4" aria-hidden="true" />
                Continue without an account
              </Button>
              <p className="mt-2.5 text-[11px] leading-relaxed text-muted-foreground">
                Guest boxes stay tied to this browser. An email sign-in keeps
                them reachable anywhere.
              </p>
            </>
          ) : (
            <form onSubmit={handleOtpSubmit} className="mt-7 space-y-5">
              <input type="hidden" name="email" value={step.email} />
              <input type="hidden" name="code" value={otp} />
              <div className="flex justify-center">
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  disabled={isLoading}
                  aria-label="Six-digit sign-in code"
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="h-10 w-full rounded-full text-[13px]"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Checking…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep("signIn");
                    setOtp("");
                    setError(null);
                  }}
                  className="rounded-full px-2 text-[11.5px]"
                >
                  Use a different email
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    setError(null);
                    try {
                      const formData = new FormData();
                      formData.set("email", step.email);
                      await signIn("email-otp", formData);
                    } catch {
                      setError(
                        "We couldn't send another code. Please try again.",
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="rounded-full px-2 text-[11.5px]"
                >
                  Resend code
                </Button>
              </div>
            </form>
          )}

          <p className="mt-8 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree to our{" "}
            <Link
              to="/terms"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              terms
            </Link>{" "}
            and the notes in our{" "}
            <Link
              to="/privacy"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              privacy page
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
