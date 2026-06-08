import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/kuzushi-ui";
import { AuthManager } from "@/lib/auth/manager";
import {
  COMPLETE_PROFILE_PATH,
  SIGN_IN_PATH,
  withNext,
} from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppPage() {
  const manager = new AuthManager(await createSupabaseServerClient());
  const session = await manager.getCurrentSession();

  if (!session) {
    redirect(withNext(SIGN_IN_PATH, "/app"));
  }

  if (!session.isProfileComplete) {
    redirect(withNext(COMPLETE_PROFILE_PATH, "/app"));
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-zinc-950">
      <section className="mx-auto grid w-full max-w-3xl gap-6">
        <header className="flex items-center justify-between border-b border-zinc-200 pb-5">
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
            Kuzushi Cafe
          </span>
          <SignOutButton />
        </header>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-zinc-600">
            Authenticated workspace
          </p>
          <h1 className="mt-2 text-3xl font-black">
            Welcome, {session.account.firstName}
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Signed in as {session.account.email}. The journal app shell will
            replace this protected placeholder.
          </p>
        </div>
      </section>
    </main>
  );
}
