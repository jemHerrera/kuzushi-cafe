create or replace function public.get_visible_journal_entry_partner_belts(
  target_account_id uuid,
  journal_entry_ids uuid[]
)
returns table (
  journal_entry_id uuid,
  training_partner_id uuid,
  belt public.belt
)
language sql
stable
security definer
set search_path = public
as $$
  select
    entry.id,
    partner.id,
    coalesce(account.belt, partner.partner_belt)
  from public.journal_entries as entry
  join public.training_partners as partner
    on partner.id = entry.training_partner_id
  left join public.accounts as account
    on account.id = partner.partner_account_id
  where entry.account_id = target_account_id
    and entry.id = any(journal_entry_ids)
    and public.can_view_journal_entries(entry.account_id, entry.category)
$$;

revoke all on function public.get_visible_journal_entry_partner_belts(uuid, uuid[]) from public;
grant execute on function public.get_visible_journal_entry_partner_belts(uuid, uuid[]) to authenticated;
