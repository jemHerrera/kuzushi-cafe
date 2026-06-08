create extension if not exists pg_trgm with schema extensions;

alter table public.journal_entries
  add constraint journal_entries_tap_has_no_type check (
    category <> 'tap' or journal_type is null
  );

alter table public.training_partners
  add column former_partner_account_id uuid references public.accounts(id) on delete set null;

create index training_partners_former_partner_idx
  on public.training_partners(owner_account_id, former_partner_account_id)
  where former_partner_account_id is not null;

create table public.account_blocks (
  blocker_account_id uuid not null references public.accounts(id) on delete cascade,
  blocked_account_id uuid not null references public.accounts(id) on delete cascade,
  created_date timestamptz not null default now(),
  primary key (blocker_account_id, blocked_account_id),
  constraint account_blocks_not_self check (blocker_account_id <> blocked_account_id)
);

create table public.donation_checkout_sessions (
  id text primary key,
  account_id uuid not null references public.accounts(id) on delete cascade,
  amount integer not null check (amount > 0),
  currency text not null default 'usd' check (currency = 'usd'),
  checkout_url text not null,
  status text not null default 'retryable-failure'
    check (status in ('success', 'canceled', 'retryable-failure')),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create index donation_checkout_sessions_account_idx
  on public.donation_checkout_sessions(account_id, created_date desc);

create trigger set_donation_checkout_sessions_updated_date
before update on public.donation_checkout_sessions
for each row execute function public.set_updated_date();

alter table public.account_blocks enable row level security;
alter table public.donation_checkout_sessions enable row level security;

create policy "Users can view blocks involving their account"
on public.account_blocks for select
using (
  blocker_account_id = public.current_account_id()
  or blocked_account_id = public.current_account_id()
);

create policy "Users can manage their own blocks"
on public.account_blocks for all
using (blocker_account_id = public.current_account_id())
with check (blocker_account_id = public.current_account_id());

create policy "Users can view their donation checkouts"
on public.donation_checkout_sessions for select
using (account_id = public.current_account_id());

create policy "Users can create their donation checkouts"
on public.donation_checkout_sessions for insert
with check (account_id = public.current_account_id());

create policy "Users can update their donation checkouts"
on public.donation_checkout_sessions for update
using (account_id = public.current_account_id())
with check (account_id = public.current_account_id());

create or replace function public.account_age_class(birthday date)
returns public.age_class
language sql
stable
as $$
  select case
    when birthday is null then 'unknown'::public.age_class
    when extract(year from age(current_date, birthday)) < 12 then 'kid'::public.age_class
    when extract(year from age(current_date, birthday)) < 19 then 'teen'::public.age_class
    when extract(year from age(current_date, birthday)) < 30 then 'young-adult'::public.age_class
    when extract(year from age(current_date, birthday)) < 40 then '30s'::public.age_class
    when extract(year from age(current_date, birthday)) < 50 then '40s'::public.age_class
    when extract(year from age(current_date, birthday)) < 60 then '50s'::public.age_class
    when extract(year from age(current_date, birthday)) < 70 then '60s'::public.age_class
    when extract(year from age(current_date, birthday)) < 80 then '70s'::public.age_class
    when extract(year from age(current_date, birthday)) < 90 then '80s'::public.age_class
    else '90s'::public.age_class
  end
$$;

create or replace function public.training_partner_relationship_status(
  viewer_account_id uuid,
  other_account_id uuid
)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case
    when viewer_account_id is distinct from public.current_account_id() then 'none'
    when viewer_account_id = other_account_id then 'none'
    when exists (
      select 1 from public.account_blocks
      where (blocker_account_id = viewer_account_id and blocked_account_id = other_account_id)
         or (blocker_account_id = other_account_id and blocked_account_id = viewer_account_id)
    ) then 'blocked'
    when public.are_training_partners(viewer_account_id, other_account_id) then 'accepted'
    when exists (
      select 1 from public.training_partner_requests
      where requester_account_id = viewer_account_id
        and recipient_account_id = other_account_id
    ) then 'pending-outbound'
    when exists (
      select 1 from public.training_partner_requests
      where requester_account_id = other_account_id
        and recipient_account_id = viewer_account_id
    ) then 'pending-inbound'
    when exists (
      select 1 from public.training_partners
      where owner_account_id = viewer_account_id
        and former_partner_account_id = other_account_id
    ) then 'removed'
    else 'none'
  end
$$;

create or replace function public.search_public_profiles(
  search_text text,
  result_limit integer,
  result_offset integer,
  viewer_account_id uuid default null
)
returns table (
  id uuid,
  first_name text,
  last_name text,
  bio text,
  profile_photo text,
  belt public.belt,
  relationship_status text
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select
    account.id,
    account.first_name,
    account.last_name,
    case when settings.profile = 'public'
      or account.id = viewer_account_id
      or public.are_training_partners(viewer_account_id, account.id)
      then account.bio
    end,
    account.profile_photo,
    case when settings.profile = 'public'
      or account.id = viewer_account_id
      or public.are_training_partners(viewer_account_id, account.id)
      then account.belt
    end,
    case when viewer_account_id is null then null
      else public.training_partner_relationship_status(viewer_account_id, account.id)
    end
  from public.accounts as account
  join public.account_privacy_settings as settings on settings.account_id = account.id
  where viewer_account_id is not distinct from public.current_account_id()
    and account.id <> coalesce(viewer_account_id, '00000000-0000-0000-0000-000000000000')
    and not exists (
      select 1 from public.account_blocks
      where viewer_account_id is not null
        and (
          (blocker_account_id = viewer_account_id and blocked_account_id = account.id)
          or (blocker_account_id = account.id and blocked_account_id = viewer_account_id)
        )
    )
    and (
      nullif(btrim(search_text), '') is null
      or concat_ws(' ', account.first_name, account.last_name) % search_text
      or concat_ws(' ', account.first_name, account.last_name) ilike '%' || search_text || '%'
    )
  order by
    case when nullif(btrim(search_text), '') is null then 0
      else similarity(concat_ws(' ', account.first_name, account.last_name), search_text)
    end desc,
    account.first_name nulls last,
    account.last_name nulls last
  limit greatest(0, least(result_limit, 100))
  offset greatest(0, result_offset)
$$;

create or replace function public.accept_training_partner_request(
  accepting_account_id uuid,
  requester_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
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
end;
$$;

create or replace function public.list_training_partners(
  account_id uuid,
  search_text text,
  result_limit integer,
  result_offset integer
)
returns table (
  id uuid,
  partner_account_id uuid,
  first_name text,
  last_name text,
  profile_photo text,
  partner_weight public.weight_class,
  partner_age public.age_class,
  partner_belt public.belt,
  is_account_backed boolean,
  created_date timestamptz,
  updated_date timestamptz
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select
    partner.id,
    coalesce(partner.partner_account_id, partner.former_partner_account_id),
    coalesce(account.first_name, partner.first_name),
    coalesce(account.last_name, partner.last_name),
    account.profile_photo,
    coalesce(account.weight, partner.partner_weight),
    case when account.id is null
      then partner.partner_age
      else public.account_age_class(account.birthday)
    end,
    coalesce(account.belt, partner.partner_belt),
    partner.partner_account_id is not null,
    partner.created_date,
    partner.updated_date
  from public.training_partners as partner
  left join public.accounts as account on account.id = partner.partner_account_id
  where partner.owner_account_id = account_id
    and account_id = public.current_account_id()
    and (
      nullif(btrim(search_text), '') is null
      or concat_ws(
        ' ',
        coalesce(account.first_name, partner.first_name),
        coalesce(account.last_name, partner.last_name)
      ) % search_text
      or concat_ws(
        ' ',
        coalesce(account.first_name, partner.first_name),
        coalesce(account.last_name, partner.last_name)
      ) ilike '%' || search_text || '%'
    )
  order by partner.created_date desc
  limit greatest(0, least(result_limit, 100))
  offset greatest(0, result_offset)
$$;

create or replace function public.list_training_partner_requests(
  account_id uuid,
  request_direction text,
  result_limit integer,
  result_offset integer
)
returns table (
  id uuid,
  first_name text,
  last_name text,
  bio text,
  email text,
  profile_photo text,
  belt public.belt,
  weight public.weight_class,
  birthday date,
  created_date timestamptz,
  updated_date timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    account.id,
    account.first_name,
    account.last_name,
    account.bio,
    account.email,
    account.profile_photo,
    account.belt,
    account.weight,
    account.birthday,
    request.created_date,
    request.updated_date
  from public.training_partner_requests as request
  join public.accounts as account
    on account.id = case
      when request_direction = 'inbound' then request.requester_account_id
      else request.recipient_account_id
    end
  where account_id = public.current_account_id()
    and (
      (request_direction = 'inbound' and request.recipient_account_id = account_id)
      or (request_direction = 'outbound' and request.requester_account_id = account_id)
    )
  order by request.created_date desc
  limit greatest(0, least(result_limit, 100))
  offset greatest(0, result_offset)
$$;

create or replace function public.detach_training_partner(
  account_id uuid,
  training_partner_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  other_account_id uuid;
begin
  if account_id <> public.current_account_id() then
    raise exception 'not authorized';
  end if;

  select partner_account_id into other_account_id
  from public.training_partners
  where id = training_partner_id and owner_account_id = account_id
  for update;

  if not found then
    raise exception 'training partner not found';
  end if;

  if other_account_id is null then
    return;
  end if;

  update public.training_partners as partner
  set
    former_partner_account_id = partner.partner_account_id,
    first_name = account.first_name,
    last_name = account.last_name,
    partner_weight = account.weight,
    partner_age = public.account_age_class(account.birthday),
    partner_belt = account.belt,
    partner_account_id = null
  from public.accounts as account
  where partner.owner_account_id = account_id
    and partner.partner_account_id = other_account_id
    and account.id = other_account_id;

  update public.training_partners as partner
  set
    former_partner_account_id = partner.partner_account_id,
    first_name = account.first_name,
    last_name = account.last_name,
    partner_weight = account.weight,
    partner_age = public.account_age_class(account.birthday),
    partner_belt = account.belt,
    partner_account_id = null
  from public.accounts as account
  where partner.owner_account_id = other_account_id
    and partner.partner_account_id = account_id
    and account.id = account_id;
end;
$$;

create or replace function public.block_account(
  account_id uuid,
  blocked_account_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  partner_row_id uuid;
begin
  if account_id <> public.current_account_id() or account_id = blocked_account_id then
    raise exception 'not authorized';
  end if;

  delete from public.training_partner_requests
  where (requester_account_id = account_id and recipient_account_id = blocked_account_id)
     or (requester_account_id = blocked_account_id and recipient_account_id = account_id);

  select id into partner_row_id
  from public.training_partners
  where owner_account_id = account_id and partner_account_id = blocked_account_id;

  if partner_row_id is not null then
    perform public.detach_training_partner(account_id, partner_row_id);
  end if;

  insert into public.account_blocks(blocker_account_id, blocked_account_id)
  values (account_id, blocked_account_id)
  on conflict do nothing;
end;
$$;

create or replace function public.unblock_account(
  account_id uuid,
  blocked_account_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if account_id <> public.current_account_id() then
    raise exception 'not authorized';
  end if;

  delete from public.account_blocks
  where blocker_account_id = account_id
    and account_blocks.blocked_account_id = unblock_account.blocked_account_id;
end;
$$;

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

  insert into public.notifications(heading, text, category, account_id)
  select
    'New journal entry assignment',
    concat_ws(' ', owner.first_name, owner.last_name)
      || ' tagged you in "' || entry.name || '".',
    'journal-entry-partner',
    partner.partner_account_id
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

revoke all on function public.accept_training_partner_request(uuid, uuid) from public;
revoke all on function public.detach_training_partner(uuid, uuid) from public;
revoke all on function public.block_account(uuid, uuid) from public;
revoke all on function public.unblock_account(uuid, uuid) from public;
revoke all on function public.send_journal_entry_assignment_notification(uuid, uuid) from public;
grant execute on function public.accept_training_partner_request(uuid, uuid) to authenticated;
grant execute on function public.detach_training_partner(uuid, uuid) to authenticated;
grant execute on function public.block_account(uuid, uuid) to authenticated;
grant execute on function public.unblock_account(uuid, uuid) to authenticated;
grant execute on function public.send_journal_entry_assignment_notification(uuid, uuid) to authenticated;
