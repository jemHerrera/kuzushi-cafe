# Kuzushi Cafe

Kuzushi Cafe is a grappling / BJJ app for note-taking and progress tracking. The idea is to encourage introspection for BJJ hobbyists by helping them reflect on what happened during training and think through problems. The goal is for everyone to train mindfully, with intention and purpose, to accelerate progress.

Secondarily, the app introduces social features where users can add friends and tag them in journal entries. This should help maintain motivation among users and promote customer acquisition and retention.

Finally, UX is important. Manual entries involve a lot of friction, so the experience should be easy and intuitive.

## Features

- Simple account management and authentication - OTP, Google SSO
- Entries
- Friends
- In-app notifications
- Simple data visualization
- Fuzzy Search
- Donations through Stripe Checkout

## Future Features

- Points system with multipliers based on belt, age, and weight
- Chat and conversation notifications

## Monetization

The aim is to keep the app free. As much as possible, the app will be ad-free or have minimal ads. The main source of revenue will be donations. Donation UI should stay minimal: a donation banner, a small modal with preset and custom amounts, Stripe Checkout redirect, and success, cancellation, and retryable failure states.

## Tech Stack

- Node.js, TypeScript
- Supabase
- Next.js, React, Vercel
- Stripe
- Tailwind CSS or shadcn/ui
- Zod for validation

## Todos

- [x] Scaffold the Next.js TypeScript app with Tailwind CSS or shadcn/ui, linting, formatting, and baseline test tooling.
- [ ] Configure Supabase, environment variables, local development scripts, and deployment settings for Vercel.
- [ ] Translate `docs/data-model.ts` into database migrations with tables, foreign keys, constraints, indexes, privacy defaults, and RLS policies.
- [ ] Seed public technique tags from `docs/seeder.ts`.
- [ ] Implement authentication with Google SSO, magic-link email, session refresh middleware, sign-out, auth-only redirects, and protected-route handling.
- [ ] Implement account creation after provider identity verification, profile completion checks, and the complete-profile redirect flow.
- [ ] Build account and privacy managers from `docs/managers.ts`, including public-profile visibility and relationship status helpers.
- [ ] Build friend-request, friend-list, remove-friend, block, and unblock manager flows.
- [ ] Build journal-entry managers with the documented invariants for tap success clearing, trained-date defaults, and mutually exclusive partner modes.
- [ ] Build technique-tag managers for public tags, user-created private tags, fuzzy search, create, update, delete, and merge.
- [ ] Build aggregate-stat managers for timelines, category filters, success filters, series data, and stats rows.
- [ ] Build notification managers for journal-entry partner assignment notifications, list pagination, mark-read, and mark-all-read.
- [ ] Build donation checkout managers with Stripe Checkout session creation and success, canceled, and retryable-failure status handling.
- [ ] Implement the API endpoints in `docs/api-endpoints.md` with validation, normalization, authorization, pagination, and URL-backed journal filters.
- [ ] Create shared validation schemas and API response types that match `docs/managers.ts`.
- [ ] Build the app shell with side panel, header, notifications entry point, profile navigation, saved techniques, settings, and donation banner.
- [ ] Build authentication UI for Google SSO, magic-link email entry, confirmation states, expired links, errors, loading, and post-auth onboarding.
- [ ] Build account UI for `MyProfile`, `CompleteProfile`, `PrivacySettings`, and `PublicProfile`.
- [ ] Build friend UI for friend search, potential friends, inbound and outbound requests, relationship states, add, remove, block, and unfriend confirmation.
- [ ] Build journal-entry create and update modals with category, technique/setup tag inputs, attempt/success fields, intensity, gi/no-gi, partner selection, trained date, delete confirmation, and submit states.
- [ ] Build the journal-entry table with filters, sortable headings, pagination, horizontal mobile scrolling, edit/delete actions, and URL-persisted filters.
- [ ] Build aggregate overview and aggregate views with timeline filters, success filters, charts, category pills, loading states, empty states, and stats rows.
- [ ] Build saved-technique UI with search, add, edit, delete, category pills, and "create saved tag" versus "use custom text" flows from journal forms.
- [ ] Build notification UI with list pagination, deep links, mark-read, mark-all-read, empty state, loading state, error state, and retry.
- [ ] Build donation UI with preset amounts, custom amount, Stripe redirect, success, canceled, and retryable-failure return states.
- [ ] Add loading, error, empty, retry, disabled-submit, and skeleton states across all list, table, form, and aggregate surfaces.
- [ ] Add integration tests for managers, endpoint authorization, journal-entry invariants, privacy scoping, friend relationships, and donation status handling.
- [ ] Add end-to-end tests for sign-in, profile completion, journal entry CRUD, filters and sorting, friend requests, public profile visibility, saved techniques, notifications, and donation checkout return flows.
