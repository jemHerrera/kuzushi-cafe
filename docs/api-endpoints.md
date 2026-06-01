# API Endpoints

This file maps the UI in `docs/ui.md` to API endpoints. Endpoints use JSON request and response bodies unless noted otherwise.

## Conventions

- Protected endpoints use auth middleware to refresh and validate the session, then expose the authenticated `accountId` to the handler.
- Auth-only endpoints should redirect or reject authenticated users where appropriate.
- Public endpoints may still read the current session when present so profile and friendship state can be scoped to the viewer.
- List endpoints use `limit` and `offset`; journal-entry filters and sorting should stay URL-backed on the client.
- Endpoint handlers validate and normalize input, enforce resource-specific authorization, then call managers with trusted params.

## Auth

### `POST /api/auth/sign-in`

- UI: unauthenticated sign-in split, Google SSO, magic-link email entry.
- Auth middleware: no.
- Input: `SignInParams`.
- Output: `SignInResult`.
- Manager methods: `IAuthManager.signIn`.

### `GET /api/auth/session`

- UI: authenticated shell, complete-profile redirect, loading auth state.
- Auth middleware: optional session refresh, no hard auth requirement.
- Input: none.
- Output: `AuthSessionDetail | null`.
- Manager methods: `IAuthManager.getCurrentSession`.

### `POST /api/auth/sign-out`

- UI: settings/sign-out action.
- Auth middleware: yes.
- Input: none.
- Output: `{ signedOut: true }`.
- Manager methods: `IAuthManager.signOut`.

## Account And Profile

### `GET /api/account/me`

- UI: `SidePanel`, `MyProfile`, `CompleteProfile` prefill.
- Auth middleware: yes.
- Input: none.
- Output: `AccountDetail`.
- Manager methods: `IAuthManager.getCurrentSession`, or `IAccountManager.getAccount({ id: session.account.id })`.

### `PATCH /api/account/me`

- UI: `MyProfile`, `CompleteProfile`.
- Auth middleware: yes.
- Input:
  - `firstName?: string`
  - `lastName?: string`
  - `profilePhoto?: string`
  - `belt?: Belt`
  - `weight?: WeightClass`
  - `birthday?: string` ISO date
- Output: `AccountDetail`.
- Manager methods: `IAccountManager.updateAccount`.

### `GET /api/accounts/search`

- UI: `PublicProfileSearch`, side-panel profile search, find friends.
- Auth middleware: optional; required if blocked/removed relationship state must affect results.
- Input query:
  - `search?: string`
  - `limit: number`
  - `offset: number`
- Output: `{ items: PublicAccountSummary[]; limit: number; offset: number }`, where each item contains only visible public profile fields plus viewer relationship status when authenticated.
- Manager methods: `IAccountManager.searchPublicProfiles({ viewerAccountId?, search, limit, offset })`.

### `GET /api/accounts/:id`

- UI: `PublicProfile` modal.
- Auth middleware: optional.
- Input path: `id`.
- Output: public profile detail with privacy-scoped profile fields, aggregate visibility flags, journal visibility flags, and `FriendRelationshipStatus` for authenticated viewers.
- Manager methods:
  - `IAccountManager.getAccount`
  - `IAccountManager.getPrivacySettings`
  - `IAccountManager.getFriendRelationshipStatus` when authenticated
  - Endpoint stitches visible profile fields, aggregate sections, and journal sections based on privacy.

### `GET /api/account/privacy`

- UI: `PrivacySettings`.
- Auth middleware: yes.
- Input: none.
- Output: `AccountPrivacySettings`.
- Manager methods: `IAccountManager.getPrivacySettings({ accountId })`.

### `PATCH /api/account/privacy`

- UI: `PrivacySettings`.
- Auth middleware: yes.
- Input:
  - `profile?: PrivacyType`
  - `journalEntries?: PrivacyType`
  - `submissions?: PrivacyType`
  - `sweeps?: PrivacyType`
  - `reversals?: PrivacyType`
  - `backtakes?: PrivacyType`
  - `guardPasses?: PrivacyType`
  - `taps?: PrivacyType`
- Output: `AccountPrivacySettings`.
- Manager methods: `IAccountManager.updatePrivacySettings({ accountId, options })`.

## Friends

### `GET /api/friends`

- UI: `FriendsListModal`, `FriendsSelectMenu`, `TrainingPartnerInput`.
- Auth middleware: yes.
- Input query:
  - `search?: string`
  - `limit: number`
  - `offset: number`
- Output: `{ items: AccountDetail[]; limit: number; offset: number }`.
- Manager methods: `IAccountManager.getFriends({ accountId, search, limit, offset })`, or `IAccountManager.searchFriends` when `search` is present.

### `GET /api/friends/potential`

- UI: `FriendsListModal` add friend action, empty-state "Find friends".
- Auth middleware: yes.
- Input query:
  - `search?: string`
  - `limit: number`
  - `offset: number`
- Output: `{ items: PublicAccountSummary[]; limit: number; offset: number }`.
- Manager methods: `IAccountManager.getPotentialFriends({ accountId, search, limit, offset })`, or `IAccountManager.searchPotentialFriends` when `search` is present.

### `GET /api/friends/requests`

- UI: pending inbound and pending outbound friend request states.
- Auth middleware: yes.
- Input query:
  - `direction: "inbound" | "outbound"`
  - `limit: number`
  - `offset: number`
- Output: `{ items: AccountDetail[]; limit: number; offset: number }`.
- Manager methods: `IAccountManager.getFriendRequests({ accountId, direction, limit, offset })`.

### `GET /api/friends/:id/status`

- UI: `PublicProfile` relationship states.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ status: FriendRelationshipStatus }`.
- Manager methods: `IAccountManager.getFriendRelationshipStatus({ accountId, otherAccountId: id })`.

### `POST /api/friends/:id/request`

- UI: add friend.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ sent: true }`.
- Manager methods: `IAccountManager.sendFriendRequest({ fromAccountId: session.account.id, toAccountId: id })`.

### `POST /api/friends/:id/accept`

- UI: pending inbound friend request state.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ accepted: true }`.
- Manager methods: `IAccountManager.acceptFriendRequest({ accountId: session.account.id, requesterAccountId: id })`.

### `DELETE /api/friends/:id/request`

- UI: pending outbound friend request cancellation.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ canceled: true }`.
- Manager methods: `IAccountManager.cancelFriendRequest({ fromAccountId: session.account.id, toAccountId: id })`.

### `DELETE /api/friends/:id`

- UI: remove friend, unfriend confirmation.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ removed: true }`.
- Manager methods: `IAccountManager.removeFriend({ accountId: session.account.id, friendAccountId: id })`.

### `POST /api/friends/:id/block`

- UI: blocked relationship state.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ blocked: true }`.
- Manager methods: `IAccountManager.blockAccount({ accountId: session.account.id, blockedAccountId: id })`.

### `DELETE /api/friends/:id/block`

- UI: blocked relationship state recovery.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ unblocked: true }`.
- Manager methods: `IAccountManager.unblockAccount({ accountId: session.account.id, blockedAccountId: id })`.

## Journal Entries

### `GET /api/journal-entries`

- UI: `JournalEntryTable`, `JournalEntryFilters`, `JournalEntryPagination`.
- Auth middleware: yes.
- Input query:
  - `search?: string`
  - `category?: Category[]`
  - `isSuccessful?: boolean`
  - `isNoGi?: boolean`
  - `sortField?: "trainedAt" | "category" | "name" | "isSuccessful" | "trainingPartner"`
  - `sortDirection?: "asc" | "desc"`
  - `limit: number`
  - `offset: number`
- Output: `{ items: JournalEntryDetail[]; limit: number; offset: number }`.
- Manager methods: `IJournalEntryManager.getJournalEntries({ accountId: session.account.id, filter, sort, limit, offset })`, or `IJournalEntryManager.searchJournalEntries` when the request is search-first.

### `POST /api/journal-entries`

- UI: `JournalEntryCreate`.
- Auth middleware: yes.
- Input:
  - `name: string`
  - `category: Category`
  - `setup: string`
  - `isAttempt: boolean`
  - `isSuccessful?: boolean`
  - `notes?: string`
  - `intensity?: Intensity`
  - `isNoGi?: boolean`
  - exactly one partner mode:
    - `trainingPartnerAccountId?: string`
    - custom partner fields: `partnerWeight?: WeightClass`, `partnerAge?: AgeClass`, `partnerBelt?: Belt`
    - no partner fields
  - `trainedDate?: string` ISO date
  - optional endpoint convenience: `createNameTag?: boolean`, `createSetupTag?: boolean`
- Output: `JournalEntryDetail`.
- Manager methods:
  - `IJournalEntryManager.createJournalEntry`
  - optionally `IJournalEntryManager.createTag` before creation when the user chooses "Create saved tag"
  - `IJournalEntryManager.assignFriendToJournalEntry` and `INotificationManager.sendJournalEntryAssignmentNotification` if partner assignment notification is handled after creation instead of inside `createJournalEntry`

### `GET /api/journal-entries/:id`

- UI: `JournalEntryUpdate`, notification deep-link to a journal-entry modal.
- Auth middleware: yes.
- Input path: `id`.
- Output: `JournalEntryDetail`.
- Manager methods: `IJournalEntryManager.getJournalEntry`.

### `PATCH /api/journal-entries/:id`

- UI: `JournalEntryUpdate`.
- Auth middleware: yes.
- Input path: `id`.
- Input body: partial journal-entry options accepted by `IJournalEntryManager.updateJournalEntry`.
- Output: `JournalEntryDetail`.
- Manager methods:
  - `IJournalEntryManager.updateJournalEntry`
  - `IJournalEntryManager.assignFriendToJournalEntry` and `INotificationManager.sendJournalEntryAssignmentNotification` when assigning a new friend partner needs notification

### `DELETE /api/journal-entries/:id`

- UI: journal row delete action, `JournalEntryUpdate` delete button.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ deleted: true }`.
- Manager methods: `IJournalEntryManager.deleteJournalEntries({ id: [id] })`.

## Public Journal And Aggregates

### `GET /api/accounts/:id/journal-entries`

- UI: `PublicProfile` journal entries section.
- Auth middleware: optional.
- Input path: `id`.
- Input query: same filters, sort, `limit`, and `offset` as `GET /api/journal-entries`.
- Output: `{ items: JournalEntryDetail[]; limit: number; offset: number; visibility: PrivacyType }`.
- Manager methods:
  - `IAccountManager.getPrivacySettings`
  - `IAccountManager.getFriendRelationshipStatus` when authenticated
  - `IJournalEntryManager.getJournalEntries({ accountId: id, filter, sort, limit, offset })` after the endpoint determines the viewer can see entries.

### `GET /api/aggregates`

- UI: authenticated home `AggregateOverview`, `AggregateView`.
- Auth middleware: yes.
- Input query:
  - `category?: Category`
  - `timeline: "week" | "month" | "year" | "custom"`
  - `startDate?: string` ISO date
  - `endDate?: string` ISO date
  - `successfulOnly?: boolean`
- Output:
  - `category?: Category`
  - `attempts: number`
  - `successes: number`
  - `series: { label: string; attempts: number; successes: number }[]`
  - `stats: { label: string; count: number; percentage: number }[]`
- Manager methods: `IAggregateManager.getAggregateStats({ accountId: session.account.id, category, timeline, startDate, endDate, successfulOnly })`.

### `GET /api/accounts/:id/aggregates`

- UI: `PublicProfile` aggregate views.
- Auth middleware: optional.
- Input path: `id`.
- Input query: same as `GET /api/aggregates`.
- Output: same aggregate response plus `visibility: PrivacyType`.
- Manager methods:
  - `IAccountManager.getPrivacySettings`
  - `IAccountManager.getFriendRelationshipStatus` when authenticated
  - `IAggregateManager.getAggregateStats({ accountId: id, category, timeline, startDate, endDate, successfulOnly })` after the endpoint determines the viewer can see aggregates.

## Technique Tags

### `GET /api/technique-tags`

- UI: `TechniqueTagSelectMenu`, `SavedTechniqueSearch`, `SavedTechniqueTagList`.
- Auth middleware: yes.
- Input query:
  - `search?: string`
  - `category?: Category`
  - `sortField?: "label" | "category" | "createdAt"`
  - `sortDirection?: "asc" | "desc"`
  - `limit: number`
  - `offset: number`
- Output: `{ items: TechniqueTagDetail[]; limit: number; offset: number }`.
- Manager methods: `IJournalEntryManager.getTags` with `filter.accountId = session.account.id`, or `IJournalEntryManager.searchSavedTechniqueTags` when `search` is present.

### `POST /api/technique-tags`

- UI: `SavedTechniqueUpsert`, "Create saved tag" from journal entry fields.
- Auth middleware: yes.
- Input:
  - `label: string`
  - `category: Category`
- Output: `TechniqueTagDetail`.
- Manager methods: `IJournalEntryManager.createTag({ generatedBy: session.account.id, isPublic: false, ... })`.

### `PATCH /api/technique-tags/:id`

- UI: saved technique edit.
- Auth middleware: yes.
- Input path: `id`.
- Input:
  - `label?: string`
  - `category?: Category`
- Output: `TechniqueTagDetail`.
- Manager methods: `IJournalEntryManager.updateTag`. Endpoint must prevent normal users from changing `isPublic`.

### `DELETE /api/technique-tags/:id`

- UI: saved technique delete.
- Auth middleware: yes.
- Input path: `id`.
- Output: `{ deleted: true }`.
- Manager methods: `IJournalEntryManager.deleteTags({ id: [id] })`.

## Notifications

### `GET /api/notifications`

- UI: `NotificationList`, header notification button.
- Auth middleware: yes.
- Input query:
  - `limit: number`
  - `offset: number`
- Output: `{ items: NotificationDetail[]; limit: number; offset: number }`.
- Manager methods: `INotificationManager.getNotifications`.

### `PATCH /api/notifications/:id/read`

- UI: `NotificationItem` mark-as-read button.
- Auth middleware: yes.
- Input path: `id`.
- Output: `NotificationDetail`.
- Manager methods: `INotificationManager.markNotificationAsRead`.

### `PATCH /api/notifications/read-all`

- UI: `NotificationList` mark all as read.
- Auth middleware: yes.
- Input: none.
- Output: `{ updated: true }`.
- Manager methods: `INotificationManager.markAllNotificationsAsRead`.

## Donations

### `POST /api/donations/checkout`

- UI: `DonationModal` continue button.
- Auth middleware: yes, because the donation banner is inside the authenticated side panel. This can be relaxed later if donations become public.
- Input:
  - `amount: number`
  - `successUrl: string`
  - `cancelUrl: string`
- Output: `{ checkoutUrl: string }`.
- Manager methods: `IDonationManager.createCheckoutSession({ accountId, amount, successUrl, cancelUrl })`.

### `GET /api/donations/checkout-status`

- UI: donation success, canceled, and retryable failure return states.
- Auth middleware: yes.
- Input query:
  - `sessionId: string`
- Output: `{ status: "success" | "canceled" | "retryable-failure" }`.
- Manager methods: `IDonationManager.getCheckoutStatus({ accountId, sessionId })`.
