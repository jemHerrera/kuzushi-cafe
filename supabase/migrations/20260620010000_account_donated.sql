alter table public.accounts
  add column if not exists donated boolean not null default false;

update public.accounts as account
set donated = true
where exists (
  select 1
  from public.donation_checkout_sessions as session
  where session.account_id = account.id
    and session.status = 'success'
);

drop function if exists public.list_training_partner_requests(
  uuid,
  text,
  integer,
  integer
);

create function public.list_training_partner_requests(
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
  donated boolean,
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
    account.donated,
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

drop function if exists public.search_public_profiles(
  text,
  integer,
  integer,
  uuid
);

create function public.search_public_profiles(
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
  donated boolean,
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
    account.bio,
    account.profile_photo,
    account.belt,
    account.donated,
    public.training_partner_relationship_status(viewer_account_id, account.id)
  from public.accounts as account
  where viewer_account_id = public.current_account_id()
    and account.id <> viewer_account_id
    and not exists (
      select 1
      from public.account_blocks
      where
        (blocker_account_id = viewer_account_id and blocked_account_id = account.id)
        or (blocker_account_id = account.id and blocked_account_id = viewer_account_id)
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

drop function if exists public.get_public_profile(uuid, uuid);

create function public.get_public_profile(
  target_account_id uuid,
  viewer_account_id uuid default null
)
returns table (
  id uuid,
  first_name text,
  last_name text,
  bio text,
  profile_photo text,
  belt public.belt,
  donated boolean,
  relationship_status text,
  can_view_journal_entries boolean,
  can_view_activity boolean,
  can_view_stats boolean
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
    account.profile_photo,
    account.belt,
    account.donated,
    public.training_partner_relationship_status(viewer_account_id, account.id),
    public.can_view_account_section(
      account.id,
      viewer_account_id,
      settings.journal_entries
    ),
    public.can_view_account_section(
      account.id,
      viewer_account_id,
      settings.activity
    ),
    public.can_view_account_section(
      account.id,
      viewer_account_id,
      settings.stats
    )
  from public.accounts as account
  join public.account_privacy_settings as settings
    on settings.account_id = account.id
  where account.id = target_account_id
    and viewer_account_id = public.current_account_id()
    and not exists (
      select 1
      from public.account_blocks
      where blocker_account_id = account.id
        and blocked_account_id = viewer_account_id
    )
$$;

grant execute on function public.get_public_profile(uuid, uuid) to authenticated;
