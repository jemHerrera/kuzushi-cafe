import { redirect } from "next/navigation";

import { AppShell } from "@/components/kuzushi-ui";
import { JournalFormOptionsProvider } from "@/components/kuzushi-ui/JournalFormOptionsProvider";
import { AuthManager } from "@/lib/auth/manager";
import {
  COMPLETE_PROFILE_PATH,
  SIGN_IN_PATH,
  withNext,
} from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profilePath = `/profiles/${encodeURIComponent(id)}`;
  const supabase = await createSupabaseServerClient();
  const session = await new AuthManager(supabase).getCurrentSession();

  if (!session) {
    redirect(withNext(SIGN_IN_PATH, profilePath));
  }

  if (!session.isProfileComplete) {
    redirect(withNext(COMPLETE_PROFILE_PATH, profilePath));
  }

  return (
    <JournalFormOptionsProvider>
      <AppShell account={session.account} profileAccountId={id} />
    </JournalFormOptionsProvider>
  );
}
