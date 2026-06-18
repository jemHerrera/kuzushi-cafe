import Link from "next/link";

import { SignInForm, type SignInFormPreviewState } from "./SignInForm";

export function SignIn({
  next,
  initialError,
  previewState,
  showTerms = false,
  title = "Sign in",
}: {
  next: string;
  initialError?: string;
  previewState?: SignInFormPreviewState;
  showTerms?: boolean;
  title?: string;
}) {
  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-black text-zinc-950">{title}</h2>
      <p className="mt-2 mb-6 text-sm leading-6 text-zinc-600">
        Continue with Google or receive a one-time sign-in link by email.
      </p>
      <SignInForm
        next={next}
        initialError={initialError}
        previewState={previewState}
      />
      {showTerms ? (
        <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
          By continuing, you agree to the{" "}
          <Link
            className="font-semibold text-zinc-700 underline underline-offset-4"
            href="/terms-of-service"
          >
            Terms of Service
          </Link>{" "}
          and acknowledge the{" "}
          <Link
            className="font-semibold text-zinc-700 underline underline-offset-4"
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
