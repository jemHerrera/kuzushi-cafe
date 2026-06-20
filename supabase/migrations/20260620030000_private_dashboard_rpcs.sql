create or replace function public.get_private_training_activity(
  account_id uuid,
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
  where $1 = public.current_account_id()
    and entry.account_id = $1
    and coalesce(entry.trained_date, entry.created_date)::date
      between $2 and $3
  group by coalesce(entry.trained_date, entry.created_date)::date
  order by activity_date
$$;

create or replace function public.get_private_stats(
  account_id uuid,
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
    (array_agg(btrim(entry.name) order by btrim(entry.name) collate "C"))[1]
      as label,
    count(*) filter (where entry.journal_type = 'attempt') as attempts,
    count(*) filter (where entry.journal_type = 'success') as successes,
    count(*) as occurrences
  from public.journal_entries as entry
  where $1 = public.current_account_id()
    and entry.account_id = $1
    and entry.category = $2
    and coalesce(entry.trained_date, entry.created_date) >= $3
    and coalesce(entry.trained_date, entry.created_date) < $4
    and (
      $2 = 'tap'
      or (
        entry.journal_type is not null
        and (not $5 or entry.journal_type = 'success')
      )
    )
  group by lower(btrim(entry.name))
$$;

create or replace function public.list_private_journal_entries_by_partner(
  account_id uuid,
  search text default null,
  categories public.category[] default null,
  journal_types public.journal_type[] default null,
  is_no_gi boolean default null,
  sort_ascending boolean default true,
  page_limit integer default 50,
  page_offset integer default 0
)
returns setof public.journal_entries
language sql
stable
security definer
set search_path = public
as $$
  select entry.*
  from public.journal_entries as entry
  left join public.training_partners as partner
    on partner.id = entry.training_partner_id
  left join public.accounts as partner_account
    on partner_account.id = partner.partner_account_id
  cross join lateral (
    select btrim(concat_ws(
      ' ',
      coalesce(partner_account.first_name, partner.first_name),
      coalesce(partner_account.last_name, partner.last_name)
    )) as display_name
  ) as partner_display
  where $1 = public.current_account_id()
    and entry.account_id = $1
    and (
      $2 is null
      or btrim($2) = ''
      or entry.name ilike (
        '%' || replace(replace(btrim($2), '%', '\%'), '_', '\_') || '%'
      ) escape '\'
      or entry.setup ilike (
        '%' || replace(replace(btrim($2), '%', '\%'), '_', '\_') || '%'
      ) escape '\'
    )
    and ($3 is null or cardinality($3) = 0 or entry.category = any($3))
    and (
      $4 is null
      or cardinality($4) = 0
      or entry.journal_type = any($4)
    )
    and ($5 is null or entry.is_no_gi = $5)
  order by
    case when $6 then lower(partner_display.display_name) end asc,
    case when not $6 then lower(partner_display.display_name) end desc,
    entry.trained_date desc nulls last,
    entry.created_date desc,
    entry.id asc
  limit greatest($7, 0)
  offset greatest($8, 0)
$$;

revoke all on function public.get_private_training_activity(
  uuid,
  date,
  date
) from public;
revoke all on function public.get_private_stats(
  uuid,
  public.category,
  timestamptz,
  timestamptz,
  boolean
) from public;
revoke all on function public.list_private_journal_entries_by_partner(
  uuid,
  text,
  public.category[],
  public.journal_type[],
  boolean,
  boolean,
  integer,
  integer
) from public;

grant execute on function public.get_private_training_activity(
  uuid,
  date,
  date
) to authenticated;
grant execute on function public.get_private_stats(
  uuid,
  public.category,
  timestamptz,
  timestamptz,
  boolean
) to authenticated;
grant execute on function public.list_private_journal_entries_by_partner(
  uuid,
  text,
  public.category[],
  public.journal_type[],
  boolean,
  boolean,
  integer,
  integer
) to authenticated;
