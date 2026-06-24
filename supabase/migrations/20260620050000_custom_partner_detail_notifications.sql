alter type public.notification_category
add value if not exists 'custom-training-partner';

alter table public.notifications
add column link_url text;

alter table public.notifications
add constraint notifications_link_url_safe_relative check (
  link_url is null
  or (
    link_url like '/%'
    and link_url not like '//%'
    and link_url !~ '[[:cntrl:]]'
  )
);

create or replace function public.send_custom_training_partner_details_notification(
  target_account_id uuid,
  training_partner_id uuid
)
returns public.notifications
language plpgsql
security definer
set search_path = public
as $$
declare
  created_notification public.notifications;
begin
  if target_account_id <> public.current_account_id() then
    raise exception 'not authorized';
  end if;

  insert into public.notifications(
    heading,
    text,
    category,
    account_id,
    link_url
  )
  select
    'Complete training partner details',
    'You added a new custom training partner '
      || coalesce(nullif(concat_ws(' ', partner.first_name, partner.last_name), ''), 'Unnamed partner')
      || '. Add more details like belt, weight, and age.',
    'custom-training-partner',
    target_account_id,
    '/app?panel=training-partners&trainingPartnersView=edit&trainingPartnerId=' || partner.id::text
  from public.training_partners as partner
  where partner.id = training_partner_id
    and partner.owner_account_id = target_account_id
    and partner.partner_account_id is null
  returning * into created_notification;

  if created_notification.id is null then
    raise exception 'custom training partner not found';
  end if;

  return created_notification;
end;
$$;

revoke all on function public.send_custom_training_partner_details_notification(uuid, uuid)
from public;

grant execute on function public.send_custom_training_partner_details_notification(uuid, uuid)
to authenticated;
