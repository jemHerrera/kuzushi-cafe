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
    partner.partner_account_id,
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
    and partner.former_partner_account_id is null
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
    delete from public.training_partners
    where id = training_partner_id
      and owner_account_id = account_id
      and partner_account_id is null
      and former_partner_account_id is null;

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
