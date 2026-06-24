alter type public.notification_category
add value if not exists 'training-partner-accepted';

create or replace function public.accept_training_partner_request(
  accepting_account_id uuid,
  requester_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  accepter_name text;
begin
  if accepting_account_id <> public.current_account_id() then
    raise exception 'not authorized';
  end if;

  if exists (
    select 1 from public.account_blocks
    where (blocker_account_id = accepting_account_id and blocked_account_id = requester_id)
       or (blocker_account_id = requester_id and blocked_account_id = accepting_account_id)
  ) then
    raise exception 'blocked accounts cannot become training partners';
  end if;

  delete from public.training_partner_requests
  where requester_account_id = requester_id
    and recipient_account_id = accepting_account_id;

  if not found then
    raise exception 'training partner request not found';
  end if;

  insert into public.training_partners(owner_account_id, partner_account_id)
  values
    (accepting_account_id, requester_id),
    (requester_id, accepting_account_id)
  on conflict (owner_account_id, partner_account_id)
    where partner_account_id is not null
  do update set
    former_partner_account_id = null,
    first_name = null,
    last_name = null,
    partner_weight = null,
    partner_age = null,
    partner_belt = null;

  select coalesce(
    nullif(btrim(concat_ws(' ', first_name, last_name)), ''),
    email
  )
  into accepter_name
  from public.accounts
  where id = accepting_account_id;

  insert into public.notifications(
    heading,
    text,
    category,
    account_id,
    source_account_id
  )
  values (
    'Training partner request accepted',
    accepter_name || ' accepted your training partner request.',
    'training-partner-accepted',
    requester_id,
    accepting_account_id
  );
end;
$$;
