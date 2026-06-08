# API Endpoints

This file maps the UI in `docs/ui.md` to API endpoints. Endpoints use JSON request and response bodies unless noted otherwise.

## Conventions

- Protected endpoints use auth middleware to refresh and validate the session, then expose the authenticated `accountId` to the handler.
- Auth-only endpoints should redirect or reject authenticated users where appropriate.
- Public endpoints may still read the current session when present so profile and training-partner state can be scoped to the viewer.
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
  - `bio?: string`
  - `profilePhoto?: string`
  - `belt?: Belt`
  - `weight?: WeightClass`
  - `birthday?: string` ISO date
- Output: `AccountDetail`.
- Manager methods: `IAccountManager.updateAccount`.

### `GET /api/accounts/search`

- UI: `PublicProfileSearch`, side-panel profile search, find training partners.
- Auth middleware: optional; required if blocked/removed relationship state must affect results.
- Input query:
  - `search?: string`
  - `limit: number`
  - `offset: number`
- Output: `{ items: PublicAccountSummary[]; limit: number; offset: number }`, where each item contains only visible public profile fields plus viewer relationship status when authenticated.
- Manager methods: `IAccountManager.searchPublicProfiles({ viewerAccountId?, search, limit, offset })`.

### `GET /api/accounts/:id`

- UI: `PublicProfile` page component.
- Auth middleware: optional.
- Input path: `id`.
- Output: `PublicProfileDetail`, containing privacy-scoped public profile fields and `TrainingPartnerRelationshipStatus` for authenticated viewers. Aggregate and journal data are loaded from their dedicated endpoints.
- Manager methods:
  - `IAccountManager.getAccount`
  - `IAccountManager.getPrivacySettings`
  - `IAccountManager.getTrainingPartnerRelationshipStatus` when authenticated
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

## Training Partners

Accepted account-backed training partners are stored as two `TrainingPartner` rows: one owned by each account. Removing a training partner keeps both rows, clears each row's `partner`, and snapshots the former partner's first name, last name, age, weight, and belt onto the row. Custom training partners are single owner-only rows and do not have requests or reciprocal account links.

### `GET /api/training-partners`

- UI: `TrainingPartnersListModal`, `TrainingPartnerSelectMenu`, `TrainingPartnerInput`.
- Auth middleware: yes.
- Input query:
  - `search?: string`
  - `limit: number`
  - `offset: number`
- Output: `{ items: TrainingPartnerDetail[]; limit: number; offset: number }`.
- Manager methods: `IAccountManager.getTrainingPartners({ accountId, search, limit, offset })`, or `IAccountManager.searchTrainingPartners` when `search` is present.

### `GET /api/training-partners/potential`

- UI: `TrainingPartnersListModal` add training partner action, empty-state "Find training partners".
- Auth middleware: yes.
- Input query:
  - `search?: string`
  - `limit: number`
  - `offset: number`
- Output: `{ items: PublicAccountSummary[]; limit: number; offset: number }`.
- Manager methods: `IAccountManager.getPotentialTrainingPartners({ accountId, search, limit, offset })`, or `IAccountManager.searchPotentialTrainingPartners` when `search` is present.

### `POST /api/training-partners/custom`

- UI: `CustomPartnerInput`, `TrainingPartnersListModal` add custom training partner action.
- Auth middleware: yes.
- Input:
  - `firstName?: string`
  - `lastName?: string`
  - `partnerWeight?: WeightClass`
  - `partnerAge?: AgeClass`
  - `partnerBelt?: Belt`
- Output: `TrainingPartnerDetail`.
- Manager methods: `IAccountManager.createCustomTrainingPartner({ accountId: session.account.id, ... })`.
- Side effects: creates one owner-only `TrainingPartner` row with no reciprocal row.

### `GET /api/training-partners/requests`

- UI: pending inbound and pending outbound training partner request states.
- Auth middleware: yes.
- Input query:
  - `direction: "inbound" | "outbound"`
  - `limit: number`
  - `offset: number`
- Output: `{ items: AccountDetail[]; limit: number; offset: number }`.
- Manager methods: `IAccountManager.getTrainingPartnerRequests({ accountId, direction, limit, offset })`.

### `GET /api/training-partners/:id/status`

- UI: `PublicProfile` relationship states.
- Auth middleware: yes.
- Input path: `id` is the other account id.
- Output: `{ status: TrainingPartnerRelationshipStatus }`.
- Manager methods: `IAccountManager.getTrainingPartnerRelationshipStatus({ accountId, otherAccountId: id })`.

### `POST /api/training-partners/:id/request`

- UI: add training partner.
- Auth middleware: yes.
- Input path: `id` is the recipient account id.
- Output: `{ sent: true }`.
- Manager methods: `IAccountManager.sendTrainingPartnerRequest({ fromAccountId: session.account.id, toAccountId: id })`.

### `POST /api/training-partners/:id/accept`

- UI: pending inbound training partner request state.
- Auth middleware: yes.
- Input path: `id` is the requester account id.
- Output: `{ accepted: true }`.
- Manager methods: `IAccountManager.acceptTrainingPartnerRequest({ accountId: session.account.id, requesterAccountId: id })`.
- Side effects: deletes the pending request and creates both reciprocal `TrainingPartner` rows, one owned by the accepting account and one owned by the requester.

### `DELETE /api/training-partners/:id/request`

- UI: pending outbound training partner request cancellation.
- Auth middleware: yes.
- Input path: `id` is the recipient account id.
- Output: `{ canceled: true }`.
- Manager methods: `IAccountManager.cancelTrainingPartnerRequest({ fromAccountId: session.account.id, toAccountId: id })`.

### `DELETE /api/training-partners/:id`

- UI: remove training partner confirmation.
- Auth middleware: yes.
- Input path: `id` is the `TrainingPartner` row id owned by the authenticated account.
- Output: `{ removed: true }`.
- Manager methods: `IAccountManager.removeTrainingPartner({ accountId: session.account.id, trainingPartnerId: id })`.
- Side effects: for account-backed partners, clears `partner` on both reciprocal `TrainingPartner` rows and copies each former partner's first name, last name, age, weight, and belt into the corresponding owner-only snapshot fields. For custom partners, clears no account link because none exists and leaves the owner-only row intact.

### `POST /api/training-partners/:id/block`

- UI: blocked relationship state.
- Auth middleware: yes.
- Input path: `id` is the blocked account id.
- Output: `{ blocked: true }`.
- Manager methods: `IAccountManager.blockAccount({ accountId: session.account.id, blockedAccountId: id })`.

### `DELETE /api/training-partners/:id/block`

- UI: blocked relationship state recovery.
- Auth middleware: yes.
- Input path: `id` is the blocked account id.
- Output: `{ unblocked: true }`.
- Manager methods: `IAccountManager.unblockAccount({ accountId: session.account.id, blockedAccountId: id })`.

## Journal Entries

Journal entry type is persisted as nullable `JournalType = "attempt" | "success"`.
Tap entries use `null`. UI copy may display "Successful", but API filters,
sorts, inputs, and outputs use `success`; the former attempt/success booleans are
not part of the contract.

### `GET /api/journal-entries`

- UI: `JournalEntryTable`, `JournalEntryFilters`, `JournalEntryPagination`.
- Auth middleware: yes.
- Input query:
  - `search?: string`
  - `category?: Category[]`
  - `journalTypes?: JournalType[]`
  - `isNoGi?: boolean`
  - `sortField?: "trainedAt" | "category" | "name" | "journalType" | "trainingPartner"`
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
  - `journalType?: JournalType`
  - `notes?: string`
  - `intensity?: Intensity`
  - `isNoGi?: boolean`
  - exactly one partner mode:
    - `trainingPartnerId?: string`
    - custom partner fields: `partnerFirstName?: string`, `partnerLastName?: string`, `partnerWeight?: WeightClass`, `partnerAge?: AgeClass`, `partnerBelt?: Belt`
    - no partner fields
  - `trainedDate?: string` ISO date
  - optional endpoint convenience: `createNameTag?: boolean`, `createSetupTag?: boolean`
- Output: `JournalEntryDetail`.
- Manager methods:
  - `IJournalEntryManager.createJournalEntry`
  - optionally `IJournalEntryManager.createTag` before creation when the user chooses "Create saved tag"
  - `IJournalEntryManager.assignTrainingPartnerToJournalEntry` and `INotificationManager.sendJournalEntryAssignmentNotification` if partner assignment notification is handled after creation instead of inside `createJournalEntry`

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
- Input body: partial journal-entry options accepted by `IJournalEntryManager.updateJournalEntry`. Send `trainingPartnerId: null` to clear the current partner.
- Output: `JournalEntryDetail`.
- Manager methods:
  - `IJournalEntryManager.updateJournalEntry`
  - `IJournalEntryManager.assignTrainingPartnerToJournalEntry` and `INotificationManager.sendJournalEntryAssignmentNotification` when assigning a new account-backed training partner needs notification

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
- Output: `{ items: JournalEntryDetail[]; limit: number; offset: number; visibility: PrivacyType }`. `visibility` is the generic `journalEntries` setting; category-specific RLS still scopes returned items.
- Manager methods:
  - `IAccountManager.getPrivacySettings`
  - `IAccountManager.getTrainingPartnerRelationshipStatus` when authenticated
  - `IJournalEntryManager.getJournalEntries({ accountId: id, filter, sort, limit, offset })` after the endpoint determines the viewer can see entries.

### `GET /api/aggregates`

- UI: authenticated home `AggregateOverview`, `AggregateView`.
- Auth middleware: yes.
- Input query:
  - `category?: Category`
  - `timeline: "week" | "month" | "year" | "custom"`
  - `startDate?: string` ISO date
  - `endDate?: string` ISO date
  - `journalTypes?: JournalType[]`
- Output:
  - `category?: Category`
  - `attempts: number`
  - `successes: number`
  - `series: { label: string; attempts: number; successes: number }[]`
  - `stats: { label: string; count: number; percentage: number }[]`
- Manager methods: `IAggregateManager.getAggregateStats({ accountId: session.account.id, category, timeline, startDate, endDate, journalTypes })`.

### `GET /api/accounts/:id/aggregates`

- UI: `PublicProfile` aggregate views.
- Auth middleware: optional.
- Input path: `id`.
- Input query: same as `GET /api/aggregates`.
- Output: same aggregate response plus `visibility: PrivacyType`.
- Manager methods:
  - `IAccountManager.getPrivacySettings`
  - `IAccountManager.getTrainingPartnerRelationshipStatus` when authenticated
  - `IAggregateManager.getAggregateStats({ accountId: id, category, timeline, startDate, endDate, journalTypes })` after the endpoint determines the viewer can see aggregates.

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
