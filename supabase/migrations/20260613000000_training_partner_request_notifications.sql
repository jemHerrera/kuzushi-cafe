alter type public.notification_category
add value if not exists 'training-partner-request';

create or replace function public.send_training_partner_request(
  requester_account_id uuid,
  recipient_account_id uuid
)
returns public.notifications
language plpgsql
security definer
set search_path = public
as $$
declare
  created_notification public.notifications;
  requester_name text;
  relationship_status text;
begin
  if requester_account_id <> public.current_account_id() then
    raise exception 'not authorized';
  end if;

  relationship_status := public.training_partner_relationship_status(
    requester_account_id,
    recipient_account_id
  );

  if relationship_status not in ('none', 'removed') then
    raise exception
      'cannot send a request while relationship status is %',
      relationship_status;
  end if;

  insert into public.training_partner_requests(
    requester_account_id,
    recipient_account_id
  )
  values (requester_account_id, recipient_account_id);

  select coalesce(
    nullif(btrim(concat_ws(' ', first_name, last_name)), ''),
    email
  )
  into requester_name
  from public.accounts
  where id = requester_account_id;

  insert into public.notifications(
    heading,
    text,
    category,
    account_id,
    source_account_id
  )
  values (
    'New training partner request',
    requester_name || ' sent you a training partner request.',
    'training-partner-request',
    recipient_account_id,
    requester_account_id
  )
  returning * into created_notification;

  return created_notification;
end;
$$;

revoke all on function public.send_training_partner_request(uuid, uuid)
from public;
grant execute on function public.send_training_partner_request(uuid, uuid)
to authenticated;
