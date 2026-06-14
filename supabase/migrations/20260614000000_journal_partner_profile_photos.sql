create or replace function public.get_training_partner_profile_photos(
  account_id uuid,
  training_partner_ids uuid[]
)
returns table (
  id uuid,
  profile_photo text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    partner.id,
    account.profile_photo
  from public.training_partners as partner
  join public.accounts as account on account.id = partner.partner_account_id
  where account_id = public.current_account_id()
    and partner.owner_account_id = account_id
    and partner.id = any(training_partner_ids)
$$;
