create or replace function public.get_training_partner_profiles(
  account_id uuid,
  training_partner_ids uuid[]
)
returns table (
  id uuid,
  first_name text,
  last_name text,
  profile_photo text,
  belt public.belt,
  weight public.weight_class
)
language sql
stable
security definer
set search_path = public
as $$
  select
    partner.id,
    account.first_name,
    account.last_name,
    account.profile_photo,
    account.belt,
    account.weight
  from public.training_partners as partner
  join public.accounts as account on account.id = partner.partner_account_id
  where account_id = public.current_account_id()
    and partner.owner_account_id = account_id
    and partner.id = any(training_partner_ids)
$$;

revoke all on function public.get_training_partner_profiles(uuid, uuid[]) from public;
grant execute on function public.get_training_partner_profiles(uuid, uuid[]) to authenticated;
