alter table public.notifications
add column source_account_id uuid references public.accounts(id) on delete set null;

create index notifications_source_account_id_idx
  on public.notifications(source_account_id)
  where source_account_id is not null;

create or replace function public.send_journal_entry_assignment_notification(
  assigning_account_id uuid,
  journal_entry_id uuid
)
returns public.notifications
language plpgsql
security definer
set search_path = public
as $$
declare
  created_notification public.notifications;
begin
  if assigning_account_id <> public.current_account_id() then
    raise exception 'not authorized';
  end if;

  insert into public.notifications(
    heading,
    text,
    category,
    account_id,
    source_account_id
  )
  select
    'New journal entry assignment',
    concat_ws(' ', owner.first_name, owner.last_name)
      || ' tagged you in "' || entry.name || '".',
    'journal-entry-partner',
    partner.partner_account_id,
    assigning_account_id
  from public.journal_entries as entry
  join public.training_partners as partner on partner.id = entry.training_partner_id
  join public.accounts as owner on owner.id = entry.account_id
  where entry.id = journal_entry_id
    and entry.account_id = assigning_account_id
    and partner.owner_account_id = assigning_account_id
    and partner.partner_account_id is not null
  returning * into created_notification;

  if created_notification.id is null then
    raise exception 'account-backed journal entry assignment not found';
  end if;

  return created_notification;
end;
$$;
