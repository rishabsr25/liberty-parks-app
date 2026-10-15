-- Block app clients from granting themselves admin, including by inserting
-- a profile or deleting and recreating one. Dashboard and SQL editor
-- connections are not anon/authenticated, so those edits still work.
-- Signup inserts run as the security-definer function owner, not as the app role.

create or replace function public.block_admin_self_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'DELETE' then
      raise exception 'profiles cannot be deleted from the app';
    end if;

    if tg_op = 'INSERT' and coalesce(new.admin, false) then
      raise exception 'admin flag cannot be changed from the app';
    end if;

    if tg_op = 'UPDATE' and new.admin is distinct from old.admin then
      raise exception 'admin flag cannot be changed from the app';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end $$;

drop trigger if exists block_admin_self_change on public.profiles;

create trigger block_admin_self_change
before insert or update or delete on public.profiles
for each row execute function public.block_admin_self_change();

revoke insert, delete, truncate on table public.profiles from anon, authenticated;
