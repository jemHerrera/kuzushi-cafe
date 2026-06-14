alter table public.journal_entries
  drop constraint if exists journal_entries_setup_not_blank,
  alter column setup drop not null,
  alter column trained_date drop not null;

alter table public.journal_entries
  add constraint journal_entries_setup_not_blank check (
    setup is null or length(btrim(setup)) > 0
  );
