import { redirect } from "next/navigation";

import { AppShell } from "@/components/kuzushi-ui";
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

  return <AppShell account={session.account} />;
}
