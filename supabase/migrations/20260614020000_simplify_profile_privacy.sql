alter table public.account_privacy_settings
  add column activity public.privacy_type not null default 'training-partners',
  add column stats public.privacy_type not null default 'training-partners';

update public.account_privacy_settings
set
  journal_entries = 'training-partners',
  activity = 'training-partners',
  stats = 'training-partners';

alter table public.account_privacy_settings
  drop column profile,
  drop column submissions,
  drop column sweeps,
  drop column reversals,
  drop column backtakes,
  drop column guard_passes,
  drop column taps;

create or replace function public.can_view_account_section(
  target_account_id uuid,
  viewer_account_id uuid,
  visibility public.privacy_type
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    viewer_account_id is not null
    and viewer_account_id is not distinct from public.current_account_id()
    and not exists (
      select 1
      from public.account_blocks
      where
        (blocker_account_id = target_account_id and blocked_account_id = viewer_account_id)
        or (blocker_account_id = viewer_account_id and blocked_account_id = target_account_id)
    )
    and (
      target_account_id = viewer_account_id
      or visibility = 'public'
      or (
        visibility = 'training-partners'
        and public.are_training_partners(viewer_account_id, target_account_id)
      )
    )
$$;

create or replace function public.can_view_journal_entries(
  target_account_id uuid,
  entry_category public.category
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.can_view_account_section(
    target_account_id,
    public.current_account_id(),
    settings.journal_entries
  )
  from public.account_privacy_settings as settings
  where settings.account_id = target_account_id
$$;

drop function if exists public.can_view_account_profile(uuid);

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
    account.bio,
    account.profile_photo,
    account.belt,
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

drop function if exists public.get_public_privacy(uuid, uuid);

create or replace function public.get_public_training_activity(
  target_account_id uuid,
  viewer_account_id uuid,
  activity_start date,
  activity_end date
)
returns table (
  activity_date date,
  entry_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(entry.trained_date, entry.created_date)::date as activity_date,
    count(*) as entry_count
  from public.journal_entries as entry
  join public.account_privacy_settings as settings
    on settings.account_id = entry.account_id
  where entry.account_id = target_account_id
    and public.can_view_account_section(
      target_account_id,
      viewer_account_id,
      settings.activity
    )
    and coalesce(entry.trained_date, entry.created_date)::date
      between activity_start and activity_end
  group by coalesce(entry.trained_date, entry.created_date)::date
  order by activity_date
$$;

create or replace function public.get_public_stats(
  target_account_id uuid,
  viewer_account_id uuid,
  stats_category public.category,
  stats_start timestamptz,
  stats_end_exclusive timestamptz,
  successes_only boolean default false
)
returns table (
  label text,
  attempts bigint,
  successes bigint,
  occurrences bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    min(btrim(entry.name)) as label,
    count(*) filter (where entry.journal_type = 'attempt') as attempts,
    count(*) filter (where entry.journal_type = 'success') as successes,
    count(*) as occurrences
  from public.journal_entries as entry
  join public.account_privacy_settings as settings
    on settings.account_id = entry.account_id
  where entry.account_id = target_account_id
    and public.can_view_account_section(
      target_account_id,
      viewer_account_id,
      settings.stats
    )
    and entry.category = stats_category
    and coalesce(entry.trained_date, entry.created_date) >= stats_start
    and coalesce(entry.trained_date, entry.created_date) < stats_end_exclusive
    and (
      stats_category = 'tap'
      or (
        entry.journal_type is not null
        and (not successes_only or entry.journal_type = 'success')
      )
    )
  group by lower(btrim(entry.name))
$$;

revoke all on function public.can_view_account_section(
  uuid,
  uuid,
  public.privacy_type
) from public;
revoke all on function public.get_public_profile(uuid, uuid) from public;
revoke all on function public.get_public_training_activity(
  uuid,
  uuid,
  date,
  date
) from public;
revoke all on function public.get_public_stats(
  uuid,
  uuid,
  public.category,
  timestamptz,
  timestamptz,
  boolean
) from public;

grant execute on function public.get_public_profile(uuid, uuid) to authenticated;
grant execute on function public.get_public_training_activity(
  uuid,
  uuid,
  date,
  date
) to authenticated;
grant execute on function public.get_public_stats(
  uuid,
  uuid,
  public.category,
  timestamptz,
  timestamptz,
  boolean
) to authenticated;
