import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import type { Database } from "@/lib/supabase/database.types";

const serverClient = vi.hoisted(() => ({
  current: null as SupabaseClient<Database> | null,
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: async () => {
    if (!serverClient.current) throw new Error("Missing test client.");
    return serverClient.current;
  },
}));

import * as accountProfileRoute from "@/app/api/accounts/[id]/route";
import * as publicActivityRoute from "@/app/api/accounts/[id]/training-activity/route";
import * as publicJournalRoute from "@/app/api/accounts/[id]/journal-entries/route";
import * as publicStatsRoute from "@/app/api/accounts/[id]/stats/route";
import * as journalDetailRoute from "@/app/api/journal-entries/[id]/route";
import * as journalRoute from "@/app/api/journal-entries/route";
import * as notificationReadRoute from "@/app/api/notifications/[id]/read/route";
import * as indicatorRoute from "@/app/api/notifications/indicators/route";
import * as notificationRoute from "@/app/api/notifications/route";
import * as statsRoute from "@/app/api/stats/route";
import * as tagDetailRoute from "@/app/api/technique-tags/[id]/route";
import * as tagRoute from "@/app/api/technique-tags/route";
import * as blockRoute from "@/app/api/training-partners/[id]/block/route";
import * as requestRoute from "@/app/api/training-partners/[id]/request/route";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const hasLocalSupabase = Boolean(
  supabaseUrl?.includes("127.0.0.1") && anonKey && serviceKey,
);

describe.skipIf(!hasLocalSupabase)("API route integration", () => {
  const admin = createClient<Database>(
    supabaseUrl || "http://127.0.0.1:54321",
    serviceKey || "missing-service-key",
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
  const password = "route-integration-password";
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const users = [
    {
      email: `route-a-${suffix}@example.com`,
      id: "",
      accountId: "",
      client: null as SupabaseClient<Database> | null,
    },
    {
      email: `route-b-${suffix}@example.com`,
      id: "",
      accountId: "",
      client: null as SupabaseClient<Database> | null,
    },
  ];

  beforeAll(async () => {
    for (const [index, testUser] of users.entries()) {
      const { data, error } = await admin.auth.admin.createUser({
        email: testUser.email,
        password,
        email_confirm: true,
      });
      if (error || !data.user)
        throw error ?? new Error("User creation failed.");
      testUser.id = data.user.id;
      const { data: account, error: accountError } = await admin
        .from("accounts")
        .insert({
          auth_user_id: testUser.id,
          auth_provider: "magic-link",
          email: testUser.email,
          first_name: `Route${index}`,
          last_name: "Tester",
        })
        .select("id")
        .single();
      if (accountError || !account)
        throw accountError ?? new Error("Account creation failed.");
      testUser.accountId = account.id;
      const client = createClient<Database>(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { error: signInError } = await client.auth.signInWithPassword({
        email: testUser.email,
        password,
      });
      if (signInError) throw signInError;
      testUser.client = client;
    }
  }, 30_000);

  afterAll(async () => {
    for (const user of users) {
      if (user.id) await admin.auth.admin.deleteUser(user.id);
    }
  });

  it("rejects protected routes without a session", async () => {
    serverClient.current = createClient<Database>(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const response = await journalRoute.GET(
      new Request("http://localhost/api/journal-entries"),
    );
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: {
        code: "authentication_required",
        message: "You must be signed in.",
      },
    });
  });

  it("validates, normalizes, filters, and paginates journal requests", async () => {
    serverClient.current = users[0].client;
    const malformed = await journalRoute.POST(
      new Request("http://localhost/api/journal-entries", {
        method: "POST",
        body: "{",
      }),
    );
    expect(malformed.status).toBe(400);

    const created = await journalRoute.POST(
      jsonRequest("/api/journal-entries", "POST", {
        name: "  Armbar  ",
        setup: "  Closed guard  ",
        category: "submission",
        journalType: "success",
        isNoGi: true,
        trainedDate: "2026-06-01",
      }),
    );
    expect(created.status).toBe(201);
    const entry = await created.json();
    expect(entry.name).toBe("Armbar");
    expect(entry.setup).toBe("Closed guard");

    const listed = await journalRoute.GET(
      new Request(
        "http://localhost/api/journal-entries?category=submission,submission&journalTypes=success&isNoGi=true&limit=1&offset=0",
      ),
    );
    expect(listed.status).toBe(200);
    expect(await listed.json()).toMatchObject({
      items: [{ id: entry.id }],
      limit: 1,
      offset: 0,
    });

    const invalid = await journalRoute.GET(
      new Request("http://localhost/api/journal-entries?limit=101"),
    );
    expect(invalid.status).toBe(422);
  });

  it("hides foreign journal entries and private tags as not found", async () => {
    serverClient.current = users[0].client;
    const journal = await journalRoute.POST(
      jsonRequest("/api/journal-entries", "POST", {
        name: "Triangle",
        setup: "Guard",
        category: "submission",
      }),
    );
    const journalId = (await journal.json()).id;
    const tag = await tagRoute.POST(
      jsonRequest("/api/technique-tags", "POST", {
        label: `Private ${suffix}`,
        category: "submission",
      }),
    );
    const tagId = (await tag.json()).id;

    serverClient.current = users[1].client;
    const foreignJournal = await journalDetailRoute.GET(
      new Request(`http://localhost/api/journal-entries/${journalId}`),
      { params: Promise.resolve({ id: journalId }) },
    );
    expect(foreignJournal.status).toBe(404);

    const foreignTag = await tagDetailRoute.PATCH(
      jsonRequest(`/api/technique-tags/${tagId}`, "PATCH", {
        label: "Stolen",
      }),
      { params: Promise.resolve({ id: tagId }) },
    );
    expect(foreignTag.status).toBe(404);
  });

  it("rejects Tap as a saved-tag category", async () => {
    serverClient.current = users[0].client;
    const createResponse = await tagRoute.POST(
      jsonRequest("/api/technique-tags", "POST", {
        label: `Invalid Tap ${suffix}`,
        category: "tap",
      }),
    );
    expect(createResponse.status).toBe(422);

    const created = await tagRoute.POST(
      jsonRequest("/api/technique-tags", "POST", {
        label: `Valid tag ${suffix}`,
        category: "submission",
      }),
    );
    expect(created.status).toBe(201);
    const tagId = (await created.json()).id as string;

    const updateResponse = await tagDetailRoute.PATCH(
      jsonRequest(`/api/technique-tags/${tagId}`, "PATCH", {
        category: "tap",
      }),
      { params: Promise.resolve({ id: tagId }) },
    );
    expect(updateResponse.status).toBe(422);
  });

  it("includes partner snapshots in journal list results", async () => {
    serverClient.current = users[0].client;
    const created = await journalRoute.POST(
      jsonRequest("/api/journal-entries", "POST", {
        name: "Partner entry",
        setup: "Open guard",
        category: "sweep",
        partnerFirstName: "Batch",
        partnerLastName: "Partner",
      }),
    );
    expect(created.status).toBe(201);

    const listed = await journalRoute.GET(
      new Request(
        "http://localhost/api/journal-entries?search=Partner%20entry",
      ),
    );
    expect(listed.status).toBe(200);
    expect(await listed.json()).toMatchObject({
      items: [
        {
          name: "Partner entry",
          trainingPartner: {
            firstName: "Batch",
            lastName: "Partner",
          },
        },
      ],
    });
  });

  it("sorts journal entries by training partner with database pagination beyond 1000 rows", async () => {
    serverClient.current = users[0].client;
    const token = `partner-sort-${suffix}`;
    const { error } = await admin.from("journal_entries").insert(
      Array.from({ length: 1001 }, (_, index) => ({
        account_id: users[0].accountId,
        category: "other",
        name: `${token} filler ${index}`,
        journal_type: "success",
        trained_date: "2026-06-01T12:00:00.000Z",
      })),
    );
    expect(error).toBeNull();

    const created = await journalRoute.POST(
      jsonRequest("/api/journal-entries", "POST", {
        name: `${token} named partner`,
        category: "other",
        partnerFirstName: "Aardvark",
        partnerLastName: "Partner",
        trainedDate: "2026-06-01",
      }),
    );
    expect(created.status).toBe(201);

    const listed = await journalRoute.GET(
      new Request(
        `http://localhost/api/journal-entries?search=${token}&sortField=trainingPartner&sortDirection=asc&limit=2&offset=1001`,
      ),
    );
    expect(listed.status).toBe(200);
    expect(await listed.json()).toMatchObject({
      items: [
        {
          name: `${token} named partner`,
          trainingPartner: {
            firstName: "Aardvark",
            lastName: "Partner",
          },
        },
      ],
      limit: 2,
      offset: 1001,
    });
  });

  it("aggregates dashboard stats by category, date, type, and normalized technique", async () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const createdDate = `${today}T10:00:00.000Z`;
    const previousYear = `${now.getUTCFullYear() - 1}-01-15T12:00:00.000Z`;
    serverClient.current = users[0].client;

    const { error } = await admin.from("journal_entries").insert([
      {
        account_id: users[0].accountId,
        category: "leg-entry",
        name: "  Saddle Entry  ",
        journal_type: "success",
        trained_date: `${today}T12:00:00.000Z`,
        created_date: createdDate,
      },
      {
        account_id: users[0].accountId,
        category: "leg-entry",
        name: "saddle entry",
        journal_type: "attempt",
        trained_date: `${today}T13:00:00.000Z`,
        created_date: createdDate,
      },
      {
        account_id: users[0].accountId,
        category: "leg-entry",
        name: "Inside Sankaku",
        journal_type: "success",
        trained_date: `${today}T14:00:00.000Z`,
        created_date: createdDate,
      },
      {
        account_id: users[0].accountId,
        category: "leg-entry",
        name: "Old entry",
        journal_type: "success",
        trained_date: previousYear,
        created_date: createdDate,
      },
      {
        account_id: users[0].accountId,
        category: "leg-entry",
        name: "Created fallback",
        journal_type: "success",
        trained_date: null,
        created_date: `${today}T15:00:00.000Z`,
      },
      {
        account_id: users[0].accountId,
        category: "tap",
        name: "Triangle",
        journal_type: null,
        trained_date: `${today}T16:00:00.000Z`,
        created_date: createdDate,
      },
    ]);
    expect(error).toBeNull();

    const all = await statsRoute.GET(
      new Request(
        "http://localhost/api/stats?category=leg-entry&timeline=month&type=all",
      ),
    );
    expect(all.status).toBe(200);
    expect(await all.json()).toMatchObject({
      category: "leg-entry",
      timeline: "month",
      type: "all",
      items: [
        {
          label: "Saddle Entry",
          attempts: 1,
          successes: 1,
          occurrences: 2,
        },
        {
          label: "Created fallback",
          attempts: 0,
          successes: 1,
          occurrences: 1,
        },
        {
          label: "Inside Sankaku",
          attempts: 0,
          successes: 1,
          occurrences: 1,
        },
      ],
    });

    const successes = await statsRoute.GET(
      new Request(
        "http://localhost/api/stats?category=leg-entry&timeline=month&type=success",
      ),
    );
    expect(successes.status).toBe(200);
    expect((await successes.json()).items).toEqual([
      {
        label: "Created fallback",
        attempts: 0,
        successes: 1,
        occurrences: 1,
      },
      {
        label: "Inside Sankaku",
        attempts: 0,
        successes: 1,
        occurrences: 1,
      },
      {
        label: "Saddle Entry",
        attempts: 0,
        successes: 1,
        occurrences: 1,
      },
    ]);

    const allTime = await statsRoute.GET(
      new Request(
        "http://localhost/api/stats?category=leg-entry&timeline=all&type=success",
      ),
    );
    expect((await allTime.json()).items).toContainEqual({
      label: "Old entry",
      attempts: 0,
      successes: 1,
      occurrences: 1,
    });

    const taps = await statsRoute.GET(
      new Request(
        "http://localhost/api/stats?category=tap&timeline=month&type=success",
      ),
    );
    expect(await taps.json()).toMatchObject({
      type: "all",
      items: [
        {
          label: "Triangle",
          attempts: 0,
          successes: 0,
          occurrences: 1,
        },
      ],
    });

    const empty = await statsRoute.GET(
      new Request(
        "http://localhost/api/stats?category=off-balance&timeline=week&type=all",
      ),
    );
    expect((await empty.json()).items).toEqual([]);
  });

  it("creates one notification atomically with a training partner request", async () => {
    serverClient.current = users[0].client;
    const sent = await requestRoute.POST(
      new Request(
        `http://localhost/api/training-partners/${users[1].accountId}/request`,
        { method: "POST" },
      ),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(sent.status).toBe(200);

    const duplicate = await requestRoute.POST(
      new Request(
        `http://localhost/api/training-partners/${users[1].accountId}/request`,
        { method: "POST" },
      ),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(duplicate.status).toBe(409);

    serverClient.current = users[1].client;
    const notifications = await notificationRoute.GET(
      new Request("http://localhost/api/notifications?limit=10&offset=0"),
    );
    expect(notifications.status).toBe(200);
    const notificationList = await notifications.json();
    expect(notificationList).toMatchObject({
      items: [
        {
          category: "training-partner-request",
          isRead: false,
          sourceAccountId: users[0].accountId,
        },
      ],
    });

    const indicators = await indicatorRoute.GET();
    expect(indicators.status).toBe(200);
    expect(await indicators.json()).toEqual({
      hasUnreadNotifications: true,
      hasInboundTrainingPartnerRequests: true,
    });

    const notificationId = notificationList.items[0].id as string;
    const markedRead = await notificationReadRoute.PATCH(
      new Request(`http://localhost/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      }),
      { params: Promise.resolve({ id: notificationId }) },
    );
    expect(markedRead.status).toBe(200);
    expect(await (await indicatorRoute.GET()).json()).toEqual({
      hasUnreadNotifications: false,
      hasInboundTrainingPartnerRequests: true,
    });

    const { count: requestCount } = await admin
      .from("training_partner_requests")
      .select("id", { count: "exact", head: true })
      .eq("requester_account_id", users[0].accountId)
      .eq("recipient_account_id", users[1].accountId);
    const { count: notificationCount } = await admin
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("category", "training-partner-request")
      .eq("source_account_id", users[0].accountId)
      .eq("account_id", users[1].accountId);
    expect(requestCount).toBe(1);
    expect(notificationCount).toBe(1);

    serverClient.current = users[0].client;
    const canceled = await requestRoute.DELETE(
      new Request(
        `http://localhost/api/training-partners/${users[1].accountId}/request`,
        { method: "DELETE" },
      ),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(canceled.status).toBe(200);

    serverClient.current = users[1].client;
    expect(await (await indicatorRoute.GET()).json()).toEqual({
      hasUnreadNotifications: false,
      hasInboundTrainingPartnerRequests: false,
    });
  });

  it("applies independent public profile section privacy", async () => {
    const { data: defaults, error: defaultsError } = await admin
      .from("account_privacy_settings")
      .select("journal_entries,activity,stats")
      .eq("account_id", users[1].accountId)
      .single();
    expect(defaultsError).toBeNull();
    expect(defaults).toEqual({
      journal_entries: "training-partners",
      activity: "training-partners",
      stats: "training-partners",
    });

    await admin
      .from("account_privacy_settings")
      .update({
        journal_entries: "public",
        activity: "private",
        stats: "public",
      })
      .eq("account_id", users[1].accountId);

    serverClient.current = users[1].client;
    await journalRoute.POST(
      jsonRequest("/api/journal-entries", "POST", {
        name: "Public entry",
        setup: "Open guard",
        category: "submission",
        journalType: "success",
      }),
    );

    serverClient.current = users[0].client;
    const profile = await accountProfileRoute.GET(
      new Request(`http://localhost/api/accounts/${users[1].accountId}`),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(profile.status).toBe(200);
    expect(await profile.json()).toMatchObject({
      firstName: "Route1",
      visibility: {
        journalEntries: true,
        activity: false,
        stats: true,
      },
    });

    const publicList = await publicJournalRoute.GET(
      new Request(
        `http://localhost/api/accounts/${users[1].accountId}/journal-entries`,
      ),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(publicList.status).toBe(200);
    expect(await publicList.json()).toMatchObject({
      items: [{ name: "Public entry" }],
    });

    const privateActivity = await publicActivityRoute.GET(
      new Request(
        `http://localhost/api/accounts/${users[1].accountId}/training-activity`,
      ),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(privateActivity.status).toBe(200);
    expect(await privateActivity.json()).toMatchObject({
      totalEntries: 0,
      activeDays: 0,
    });

    const publicStats = await publicStatsRoute.GET(
      new Request(
        `http://localhost/api/accounts/${users[1].accountId}/stats?category=submission&timeline=all&type=all`,
      ),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(publicStats.status).toBe(200);
    expect(await publicStats.json()).toMatchObject({
      items: [{ label: "Public entry", successes: 1 }],
    });

    await admin
      .from("account_privacy_settings")
      .update({
        journal_entries: "private",
        activity: "private",
        stats: "private",
      })
      .eq("account_id", users[1].accountId);

    const privateProfile = await accountProfileRoute.GET(
      new Request(`http://localhost/api/accounts/${users[1].accountId}`),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(await privateProfile.json()).toMatchObject({
      visibility: {
        journalEntries: false,
        activity: false,
        stats: false,
      },
    });

    const { error: partnerError } = await admin
      .from("training_partners")
      .insert([
        {
          owner_account_id: users[0].accountId,
          partner_account_id: users[1].accountId,
        },
        {
          owner_account_id: users[1].accountId,
          partner_account_id: users[0].accountId,
        },
      ]);
    expect(partnerError).toBeNull();
    await admin
      .from("account_privacy_settings")
      .update({
        journal_entries: "training-partners",
        activity: "training-partners",
        stats: "training-partners",
      })
      .eq("account_id", users[1].accountId);

    const partnerProfile = await accountProfileRoute.GET(
      new Request(`http://localhost/api/accounts/${users[1].accountId}`),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(await partnerProfile.json()).toMatchObject({
      relationshipStatus: "accepted",
      visibility: {
        journalEntries: true,
        activity: true,
        stats: true,
      },
    });
  });

  it("allows blockers to revisit a basic profile but denies blocked viewers", async () => {
    serverClient.current = users[0].client;
    const blocked = await blockRoute.POST(
      new Request(
        `http://localhost/api/training-partners/${users[1].accountId}/block`,
        { method: "POST" },
      ),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(blocked.status).toBe(200);
    const blockerView = await accountProfileRoute.GET(
      new Request(`http://localhost/api/accounts/${users[1].accountId}`),
      { params: Promise.resolve({ id: users[1].accountId }) },
    );
    expect(blockerView.status).toBe(200);
    expect(await blockerView.json()).toMatchObject({
      relationshipStatus: "blocked",
      visibility: {
        journalEntries: false,
        activity: false,
        stats: false,
      },
    });

    serverClient.current = users[1].client;
    const blockedViewer = await accountProfileRoute.GET(
      new Request(`http://localhost/api/accounts/${users[0].accountId}`),
      { params: Promise.resolve({ id: users[0].accountId }) },
    );
    expect(blockedViewer.status).toBe(404);
  });
});

function jsonRequest(path: string, method: string, body: unknown) {
  return new Request(`http://localhost${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
