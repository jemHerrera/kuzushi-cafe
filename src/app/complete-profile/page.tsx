import { redirect } from "next/navigation";

import { CompleteProfile } from "@/components/kuzushi-ui";
import { AuthManager } from "@/lib/auth/manager";
import { safeRelativePath, SIGN_IN_PATH, withNext } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function CompleteProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeRelativePath((await searchParams).next);
  const manager = new AuthManager(await createSupabaseServerClient());
  const session = await manager.getCurrentSession();

  if (!session) {
    redirect(withNext(SIGN_IN_PATH, next));
  }

  if (session.isProfileComplete) {
    redirect(next);
  }

  return <CompleteProfile account={session.account} next={next} />;
}
