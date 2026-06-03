create type public.belt as enum (
  'unknown',
  'white',
  'blue',
  'purple',
  'brown',
  'black',
  'coral'
);

create type public.weight_class as enum (
  'unknown',
  'feather',
  'light',
  'middle',
  'heavy'
);

create type public.age_class as enum (
  'unknown',
  'kid',
  'teen',
  'young-adult',
  '30s',
  '40s',
  '50s',
  '60s',
  '70s',
  '80s',
  '90s'
);

create type public.intensity as enum (
  'playful',
  'casual',
  'intense'
);

create type public.category as enum (
  'submission',
  'takedown',
  'sweep',
  'guard-pass',
  'reversal',
  'back-take',
  'leg-entry',
  'escape',
  'tap',
  'off-balance',
  'position',
  'guard-retention',
  'other'
);

create type public.notification_category as enum (
  'journal-entry-partner',
  'chat'
);

create type public.privacy_type as enum (
  'public',
  'training-partners',
  'private'
);

create type public.auth_provider as enum (
  'google',
  'magic-link'
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text not null,
  profile_photo text,
  belt public.belt not null default 'unknown',
  weight public.weight_class not null default 'unknown',
  birthday date,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  auth_provider public.auth_provider not null,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  constraint accounts_email_not_blank check (length(btrim(email)) > 0),
  constraint accounts_first_name_not_blank check (
    first_name is null or length(btrim(first_name)) > 0
  ),
  constraint accounts_last_name_not_blank check (
    last_name is null or length(btrim(last_name)) > 0
  ),
  constraint accounts_profile_photo_not_blank check (
    profile_photo is null or length(btrim(profile_photo)) > 0
  ),
  constraint accounts_birthday_not_future check (
    birthday is null or birthday <= current_date
  )
);

create unique index accounts_auth_user_id_key on public.accounts(auth_user_id);
create unique index accounts_email_lower_key on public.accounts(lower(email));
create index accounts_created_date_idx on public.accounts(created_date desc);
create index accounts_public_profile_search_idx
  on public.accounts(lower(coalesce(first_name, '')), lower(coalesce(last_name, '')));

create table public.account_privacy_settings (
  account_id uuid primary key references public.accounts(id) on delete cascade,
  profile public.privacy_type not null default 'public',
  journal_entries public.privacy_type not null default 'training-partners',
  submissions public.privacy_type not null default 'training-partners',
  sweeps public.privacy_type not null default 'training-partners',
  reversals public.privacy_type not null default 'training-partners',
  backtakes public.privacy_type not null default 'training-partners',
  guard_passes public.privacy_type not null default 'training-partners',
  taps public.privacy_type not null default 'training-partners',
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table public.training_partner_requests (
  id uuid primary key default gen_random_uuid(),
  requester_account_id uuid not null references public.accounts(id) on delete cascade,
  recipient_account_id uuid not null references public.accounts(id) on delete cascade,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  constraint training_partner_requests_not_self check (
    requester_account_id <> recipient_account_id
  )
);

create unique index training_partner_requests_one_pending_pair_key
  on public.training_partner_requests (
    least(requester_account_id, recipient_account_id),
    greatest(requester_account_id, recipient_account_id)
  );
create index training_partner_requests_requester_idx
  on public.training_partner_requests(requester_account_id, created_date desc);
create index training_partner_requests_recipient_idx
  on public.training_partner_requests(recipient_account_id, created_date desc);

create table public.training_partners (
  id uuid primary key default gen_random_uuid(),
  owner_account_id uuid not null references public.accounts(id) on delete cascade,
  partner_account_id uuid references public.accounts(id) on delete set null,
  first_name text,
  last_name text,
  partner_weight public.weight_class,
  partner_age public.age_class,
  partner_belt public.belt,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  constraint training_partners_not_self check (
    partner_account_id is null or owner_account_id <> partner_account_id
  ),
  constraint training_partners_first_name_not_blank check (
    first_name is null or length(btrim(first_name)) > 0
  ),
  constraint training_partners_last_name_not_blank check (
    last_name is null or length(btrim(last_name)) > 0
  ),
  constraint training_partners_has_partner_or_snapshot check (
    partner_account_id is not null
    or first_name is not null
    or last_name is not null
    or partner_weight is not null
    or partner_age is not null
    or partner_belt is not null
  )
);

create unique index training_partners_owner_partner_key
  on public.training_partners(owner_account_id, partner_account_id)
  where partner_account_id is not null;
create index training_partners_owner_idx
  on public.training_partners(owner_account_id, created_date desc);
create index training_partners_partner_idx
  on public.training_partners(partner_account_id)
  where partner_account_id is not null;
create index training_partners_snapshot_search_idx
  on public.training_partners(
    owner_account_id,
    lower(coalesce(first_name, '')),
    lower(coalesce(last_name, ''))
  );

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts(id) on delete cascade,
  name text not null,
  category public.category not null,
  setup text not null,
  is_attempt boolean not null default true,
  is_successful boolean,
  notes text,
  intensity public.intensity,
  is_no_gi boolean,
  training_partner_id uuid references public.training_partners(id) on delete set null,
  trained_date timestamptz not null default now(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  constraint journal_entries_name_not_blank check (length(btrim(name)) > 0),
  constraint journal_entries_setup_not_blank check (length(btrim(setup)) > 0),
  constraint journal_entries_tap_has_no_success check (
    category <> 'tap' or is_successful is null
  )
);

create index journal_entries_account_trained_date_idx
  on public.journal_entries(account_id, trained_date desc);
create index journal_entries_account_category_idx
  on public.journal_entries(account_id, category, trained_date desc);
create index journal_entries_training_partner_idx
  on public.journal_entries(training_partner_id)
  where training_partner_id is not null;
create index journal_entries_success_idx
  on public.journal_entries(account_id, is_successful)
  where is_successful is not null;
create index journal_entries_gi_idx
  on public.journal_entries(account_id, is_no_gi)
  where is_no_gi is not null;
create index journal_entries_name_search_idx
  on public.journal_entries(account_id, lower(name));
create index journal_entries_setup_search_idx
  on public.journal_entries(account_id, lower(setup));

create table public.technique_tags (
  key text primary key,
  label text not null,
  category public.category not null,
  generated_by_account_id uuid references public.accounts(id) on delete cascade,
  is_public boolean not null default false,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  constraint technique_tags_key_format check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint technique_tags_label_not_blank check (length(btrim(label)) > 0)
);

create unique index technique_tags_public_label_category_key
  on public.technique_tags(lower(label), category)
  where is_public and generated_by_account_id is null;
create unique index technique_tags_owner_label_category_key
  on public.technique_tags(generated_by_account_id, lower(label), category)
  where generated_by_account_id is not null;
create index technique_tags_visibility_idx
  on public.technique_tags(is_public, generated_by_account_id, category, label);
create index technique_tags_search_idx
  on public.technique_tags(lower(label));

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  text text not null,
  category public.notification_category not null,
  account_id uuid not null references public.accounts(id) on delete cascade,
  is_read boolean not null default false,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  constraint notifications_heading_not_blank check (length(btrim(heading)) > 0),
  constraint notifications_text_not_blank check (length(btrim(text)) > 0)
);

create index notifications_account_created_date_idx
  on public.notifications(account_id, created_date desc);
create index notifications_unread_idx
  on public.notifications(account_id, created_date desc)
  where not is_read;

create or replace function public.set_updated_date()
returns trigger
language plpgsql
as $$
begin
  new.updated_date = now();
  return new;
end;
$$;

create trigger set_accounts_updated_date
before update on public.accounts
for each row execute function public.set_updated_date();

create trigger set_account_privacy_settings_updated_date
before update on public.account_privacy_settings
for each row execute function public.set_updated_date();

create trigger set_training_partner_requests_updated_date
before update on public.training_partner_requests
for each row execute function public.set_updated_date();

create trigger set_training_partners_updated_date
before update on public.training_partners
for each row execute function public.set_updated_date();

create trigger set_journal_entries_updated_date
before update on public.journal_entries
for each row execute function public.set_updated_date();

create trigger set_technique_tags_updated_date
before update on public.technique_tags
for each row execute function public.set_updated_date();

create trigger set_notifications_updated_date
before update on public.notifications
for each row execute function public.set_updated_date();

create or replace function public.create_default_privacy_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.account_privacy_settings(account_id)
  values (new.id);

  return new;
end;
$$;

create trigger create_default_privacy_settings
after insert on public.accounts
for each row execute function public.create_default_privacy_settings();

create or replace function public.current_account_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.accounts
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.are_training_partners(
  first_account_id uuid,
  second_account_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.training_partners
    where owner_account_id = first_account_id
      and partner_account_id = second_account_id
  )
  and exists (
    select 1
    from public.training_partners
    where owner_account_id = second_account_id
      and partner_account_id = first_account_id
  )
$$;

create or replace function public.can_view_account_profile(
  target_account_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when target_account_id = public.current_account_id() then true
    when settings.profile = 'public' then true
    when settings.profile = 'training-partners' then public.are_training_partners(
      public.current_account_id(),
      target_account_id
    )
    else false
  end
  from public.account_privacy_settings as settings
  where settings.account_id = target_account_id
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
  select case
    when target_account_id = public.current_account_id() then true
    when visibility = 'public' then true
    when visibility = 'training-partners' then public.are_training_partners(
      public.current_account_id(),
      target_account_id
    )
    else false
  end
  from (
    select case entry_category
      when 'submission' then submissions
      when 'sweep' then sweeps
      when 'reversal' then reversals
      when 'back-take' then backtakes
      when 'guard-pass' then guard_passes
      when 'tap' then taps
      else journal_entries
    end as visibility
    from public.account_privacy_settings
    where account_id = target_account_id
  ) as scoped_visibility
$$;

create or replace function public.journal_entry_training_partner_belongs_to_account()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.training_partner_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.training_partners
    where id = new.training_partner_id
      and owner_account_id = new.account_id
  ) then
    raise exception 'journal entry training partner must belong to the entry account';
  end if;

  return new;
end;
$$;

create trigger journal_entry_training_partner_belongs_to_account
before insert or update of account_id, training_partner_id on public.journal_entries
for each row execute function public.journal_entry_training_partner_belongs_to_account();

alter table public.accounts enable row level security;
alter table public.account_privacy_settings enable row level security;
alter table public.training_partner_requests enable row level security;
alter table public.training_partners enable row level security;
alter table public.journal_entries enable row level security;
alter table public.technique_tags enable row level security;
alter table public.notifications enable row level security;

create policy "Users can read their own account"
on public.accounts
for select
using (id = public.current_account_id());

create policy "Users can create their own account"
on public.accounts
for insert
with check (auth_user_id = auth.uid());

create policy "Users can update their own account"
on public.accounts
for update
using (id = public.current_account_id())
with check (id = public.current_account_id() and auth_user_id = auth.uid());

create policy "Users can read their own privacy settings"
on public.account_privacy_settings
for select
using (account_id = public.current_account_id());

create policy "Users can update their own privacy settings"
on public.account_privacy_settings
for update
using (account_id = public.current_account_id())
with check (account_id = public.current_account_id());

create policy "Users can view their own training partner requests"
on public.training_partner_requests
for select
using (
  requester_account_id = public.current_account_id()
  or recipient_account_id = public.current_account_id()
);

create policy "Users can send their own training partner requests"
on public.training_partner_requests
for insert
with check (requester_account_id = public.current_account_id());

create policy "Users can delete their own training partner requests"
on public.training_partner_requests
for delete
using (
  requester_account_id = public.current_account_id()
  or recipient_account_id = public.current_account_id()
);

create policy "Users can view their own training partners"
on public.training_partners
for select
using (owner_account_id = public.current_account_id());

create policy "Users can create their own training partners"
on public.training_partners
for insert
with check (owner_account_id = public.current_account_id());

create policy "Users can update their own training partners"
on public.training_partners
for update
using (owner_account_id = public.current_account_id())
with check (owner_account_id = public.current_account_id());

create policy "Users can delete their own training partners"
on public.training_partners
for delete
using (owner_account_id = public.current_account_id());

create policy "Journal entries are visible according to privacy"
on public.journal_entries
for select
using (public.can_view_journal_entries(account_id, category));

create policy "Users can create their own journal entries"
on public.journal_entries
for insert
with check (account_id = public.current_account_id());

create policy "Users can update their own journal entries"
on public.journal_entries
for update
using (account_id = public.current_account_id())
with check (account_id = public.current_account_id());

create policy "Users can delete their own journal entries"
on public.journal_entries
for delete
using (account_id = public.current_account_id());

create policy "Technique tags are visible when public or owned"
on public.technique_tags
for select
using (
  is_public
  or generated_by_account_id is null
  or generated_by_account_id = public.current_account_id()
);

create policy "Users can create private technique tags"
on public.technique_tags
for insert
with check (
  generated_by_account_id = public.current_account_id()
  and not is_public
);

create policy "Users can update their own private technique tags"
on public.technique_tags
for update
using (
  generated_by_account_id = public.current_account_id()
  and not is_public
)
with check (
  generated_by_account_id = public.current_account_id()
  and not is_public
);

create policy "Users can delete their own private technique tags"
on public.technique_tags
for delete
using (
  generated_by_account_id = public.current_account_id()
  and not is_public
);

create policy "Users can view their own notifications"
on public.notifications
for select
using (account_id = public.current_account_id());

create policy "Users can update their own notifications"
on public.notifications
for update
using (account_id = public.current_account_id())
with check (account_id = public.current_account_id());
