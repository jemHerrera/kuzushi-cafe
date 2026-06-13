import { redirect } from "next/navigation";

import { AppShell } from "@/components/kuzushi-ui";
import { JournalFormOptionsProvider } from "@/components/kuzushi-ui/JournalFormOptionsProvider";
import {
  parseJournalQuery,
  serializeJournalQuery,
} from "@/lib/api/journal-query";
import { AuthManager } from "@/lib/auth/manager";
import { JournalEntryManager } from "@/lib/managers/journal";
import {
  COMPLETE_PROFILE_PATH,
  SIGN_IN_PATH,
  withNext,
} from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createSupabaseServerClient();
  const session = await new AuthManager(supabase).getCurrentSession();

  if (!session) {
    redirect(withNext(SIGN_IN_PATH, "/app"));
  }

  if (!session.isProfileComplete) {
    redirect(withNext(COMPLETE_PROFILE_PATH, "/app"));
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }
  const query = parseJournalQuery(`http://kuzushi.local/app?${params}`);
  const initialJournal = await new JournalEntryManager(
    supabase,
  ).getJournalEntries({
    accountId: session.account.id,
    ...query,
    limit: query.limit + 1,
  });

  return (
    <JournalFormOptionsProvider>
      <AppShell
        account={session.account}
        initialJournal={initialJournal}
        initialJournalQueryKey={serializeJournalQuery(query).toString()}
      />
    </JournalFormOptionsProvider>
  );
}
