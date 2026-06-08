create or replace function public.get_public_profile(
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
  relationship_status text
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
  where account.id = target_account_id
    and viewer_account_id is not distinct from public.current_account_id()
    and not exists (
      select 1 from public.account_blocks
      where viewer_account_id is not null
        and (
          (blocker_account_id = viewer_account_id and blocked_account_id = account.id)
          or (blocker_account_id = account.id and blocked_account_id = viewer_account_id)
        )
    )
$$;

create or replace function public.get_public_privacy(
  target_account_id uuid,
  viewer_account_id uuid default null
)
returns table (
  profile public.privacy_type,
  journal_entries public.privacy_type
)
language sql
stable
security definer
set search_path = public
as $$
  select settings.profile, settings.journal_entries
  from public.account_privacy_settings as settings
  where settings.account_id = target_account_id
    and viewer_account_id is not distinct from public.current_account_id()
    and not exists (
      select 1 from public.account_blocks
      where viewer_account_id is not null
        and (
          (blocker_account_id = viewer_account_id and blocked_account_id = target_account_id)
          or (blocker_account_id = target_account_id and blocked_account_id = viewer_account_id)
        )
    )
$$;

grant execute on function public.get_public_profile(uuid, uuid) to anon, authenticated;
grant execute on function public.get_public_privacy(uuid, uuid) to anon, authenticated;
