alter table public.accounts
  add column bio text,
  add constraint accounts_bio_not_blank check (
    bio is null or length(btrim(bio)) > 0
  );
