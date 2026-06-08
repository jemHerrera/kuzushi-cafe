import Link from "next/link";

import { SignInForm } from "@/components/kuzushi-ui";
import { safeRelativePath } from "@/lib/auth/redirects";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-6 py-12">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-wide text-zinc-700"
        >
          Kuzushi Cafe
        </Link>
        <h1 className="mt-8 text-3xl font-black text-zinc-950">
          Sign in to your journal
        </h1>
        <p className="mt-2 mb-6 text-sm leading-6 text-zinc-600">
          Continue with Google or receive a one-time sign-in link by email.
        </p>
        <SignInForm
          next={safeRelativePath(params.next)}
          initialError={params.error}
        />
      </section>
    </main>
  );
}
