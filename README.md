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

- Finalize managers.ts
- Finalize ui.md
