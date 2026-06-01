# Architecture

## Request Flow

```text
Client
  -> Middleware
    -> API Endpoints / Server Actions
      -> Managers
        -> Database
```

## Responsibilities

### Client

- UI state, forms, charts, navigation, and optimistic updates.

### Middleware

- Refresh and validate sessions.
- Redirect protected and auth-only routes.
- Redirect authenticated users with incomplete profiles to the complete-profile page.
- Apply broad route-level access control.
- Apply broad rate limits or abuse checks.

Middleware should stay coarse-grained. Resource-specific checks belong in endpoints or server actions.

### API Endpoints / Server Actions

- Validate and normalize input.
- Read the authenticated account context.
- Check resource-specific access rules.
- Persist URL-backed filters and sorting for journal-entry lists.
- Call managers with trusted params.
- Format responses.

### Managers

- Own domain operations.
- Enforce domain invariants.
- Avoid repeated request-level checks like session validation.

Examples: create journal entries, manage friends, assign training partners, manage tags, return training stats.

Journal-entry managers should enforce these invariants:

- If category is `tap`, clear `isSuccessful`.
- If `trainedDate` is omitted, default it to `createdDate`.
- Accept exactly one training partner mode: no partner, friend partner, or custom partner.
- Keep individual journal-entry privacy out of the model; use account and category privacy settings for scoped views.

### Database

- Tables, foreign keys, constraints, and indexes.
- Views and materialized views.
- Row-level security as the final access-control backstop.

## Auth

`IAuthManager` in `managers.ts` starts Google SSO and magic-link flows, resolves the current session, and signs users out.

Account records are created only after provider identity is verified. Accounts store provider-neutral auth metadata.
