create type public.journal_type as enum (
  'attempt',
  'success'
);

drop index if exists public.journal_entries_success_idx;

alter table public.journal_entries
  drop constraint if exists journal_entries_tap_has_no_success,
  drop column is_attempt,
  drop column is_successful,
  add column journal_type public.journal_type;

create index journal_entries_account_type_idx
  on public.journal_entries(account_id, journal_type)
  where journal_type is not null;
