create index journal_entries_name_trgm_idx
  on public.journal_entries
  using gin (name extensions.gin_trgm_ops);

create index journal_entries_setup_trgm_idx
  on public.journal_entries
  using gin (setup extensions.gin_trgm_ops);
