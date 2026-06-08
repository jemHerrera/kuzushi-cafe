# Kuzushi Cafe

Kuzushi Cafe is a grappling / BJJ app for note-taking and progress tracking. The idea is to encourage introspection for BJJ hobbyists by helping them reflect on what happened during training and think through problems. The goal is for everyone to train mindfully, with intention and purpose, to accelerate progress.

Secondarily, the app introduces social features where users can add training partners and tag them in journal entries. This should help maintain motivation among users and promote customer acquisition and retention.

Finally, UX is important. Manual entries involve a lot of friction, so the experience should be easy and intuitive.

## Features

- Simple account management and authentication - OTP, Google SSO
- Entries
- Training partners
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

## Local Development

Use a native Node.js 22 install for parity with Vercel and the Supabase CLI.
Copy `.env.example` to `.env.local`, then fill in the Supabase anon and
service-role keys from `supabase status` after starting the local stack.

```bash
npm install
npm run supabase:start
npm run dev
```

Useful local commands:

- `npm run dev` starts the Next.js app.
- `npm run dev:local` starts Supabase, then starts Next.js.
- Supabase scripts load `.env.local`, call the installed macOS arm64 CLI directly, and disable CLI telemetry to avoid local wrapper architecture issues.
- `npm run supabase:status` prints local API, Studio, and auth keys.
- `npm run supabase:reset` rebuilds the local database from migrations and seed files.
- `npm run supabase:link` links the repo using `SUPABASE_PROJECT_REF` from `.env.local`.
- `npm run supabase:push` applies pending local migrations to the linked Supabase project.
- `npm run supabase:types` regenerates `src/lib/supabase/database.types.ts`.

For Vercel, configure these environment variables:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID`
- `SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET`
- `STRIPE_SECRET_KEY`

## Authentication Configuration

The app uses Supabase SSR cookies, Google OAuth, and passwordless email links.
Local magic-link email is rendered from
`supabase/templates/magic-link.html` and can be opened in Inbucket at
`http://127.0.0.1:54324`.

For the hosted Supabase project:

- Set the site URL to `https://kuzushi.cafe`.
- Add `https://kuzushi.cafe/auth/callback` to the allowed redirect URLs.
- Configure Google using the client ID and secret for the hosted project.
- Replace the hosted Magic Link email template link with:

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">
  Sign in to Kuzushi Cafe
</a>
```

The callback accepts only app-generated relative `next` paths. External and
protocol-relative destinations are discarded.

## Todos

- [x] Scaffold the Next.js TypeScript app with Tailwind CSS or shadcn/ui, linting, formatting, and baseline test tooling.
- [x] Configure Supabase, environment variables, local development scripts, and deployment settings for Vercel.
- [x] Translate `docs/data-model.ts` into database migrations with tables, foreign keys, constraints, indexes, privacy defaults, and RLS policies.
- [x] Seed public technique tags from `docs/seeder.ts`.
- [x] Implement all components and create a components page library
- [x] Implement authentication with Google SSO, magic-link email, session refresh middleware, sign-out, auth-only redirects, and protected-route handling.
- [x] Implement account creation after provider identity verification, profile completion checks, and the complete-profile redirect flow.
- [x] Build account and privacy managers from `docs/managers.ts`, including public-profile visibility and relationship status helpers.
- [x] Build training-partner request, accepted training-partner list, reciprocal detach-and-snapshot remove-training-partner, block, and unblock manager flows.
- [x] Build journal-entry managers with the documented invariants for tap success clearing, trained-date defaults, and mutually exclusive partner modes.
- [x] Build technique-tag managers for public tags, user-created private tags, fuzzy search, create, update, delete, and merge.
- [x] Build aggregate-stat managers for timelines, category filters, success filters, series data, and stats rows.
- [x] Build notification managers for journal-entry partner assignment notifications, list pagination, mark-read, and mark-all-read.
- [x] Build donation checkout managers with Stripe Checkout session creation and success, canceled, and retryable-failure status handling.
- [ ] Implement the API endpoints in `docs/api-endpoints.md` with validation, normalization, authorization, pagination, and URL-backed journal filters.
- [ ] Create shared validation schemas and API response types that match `docs/managers.ts`.
- [ ] Build the app shell with side panel, header, notifications entry point, profile navigation, saved techniques, settings, and donation banner.
- [x] Build authentication UI for Google SSO, magic-link email entry, confirmation states, expired links, errors, loading, and post-auth onboarding.
- [ ] Build account UI for `MyProfile`, `CompleteProfile`, `PrivacySettings`, and `PublicProfile`.
- [ ] Build training-partner UI for profile search, potential training partners, inbound and outbound requests, relationship states, add, remove, block, and remove confirmation.
- [ ] Build journal-entry create and update modals with category, technique/setup tag inputs, attempt/success fields, intensity, gi/no-gi, partner selection, trained date, delete confirmation, and submit states.
- [ ] Build the journal-entry table with filters, sortable headings, pagination, horizontal mobile scrolling, edit/delete actions, and URL-persisted filters.
- [ ] Build aggregate overview and aggregate views with timeline filters, success filters, charts, category pills, loading states, empty states, and stats rows.
- [ ] Build saved-technique UI with search, add, edit, delete, category pills, and "create saved tag" flows from journal forms.
- [ ] Build notification UI with list pagination, deep links, mark-read, mark-all-read, empty state, loading state, error state, and retry.
- [ ] Build donation UI with preset amounts, custom amount, Stripe redirect, success, canceled, and retryable-failure return states.
- [ ] Add loading, error, empty, retry, disabled-submit, and skeleton states across all list, table, form, and aggregate surfaces.
- [ ] Add integration tests for managers, endpoint authorization, journal-entry invariants, privacy scoping, training-partner relationships, and donation status handling.
- [ ] Add /privacy-policy and /terms-of-service
- [ ] Add end-to-end tests for sign-in, profile completion, journal entry CRUD, filters and sorting, training-partner requests, public profile visibility, saved techniques, notifications, and donation checkout return flows.
