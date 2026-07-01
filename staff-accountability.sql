-- Run this in Supabase SQL Editor.
-- It fixes "containers_updated_by_fkey" errors and lets the app show who changed/rented a container.

alter table public.containers
add column if not exists updated_by uuid;

alter table public.rentals
add column if not exists created_by uuid,
add column if not exists updated_by uuid;

alter table public.containers
drop constraint if exists containers_updated_by_fkey;

alter table public.rentals
drop constraint if exists rentals_created_by_fkey,
drop constraint if exists rentals_updated_by_fkey;

alter table public.containers
add constraint containers_updated_by_fkey
foreign key (updated_by) references auth.users(id) on delete set null;

alter table public.rentals
add constraint rentals_created_by_fkey
foreign key (created_by) references auth.users(id) on delete set null;

alter table public.rentals
add constraint rentals_updated_by_fkey
foreign key (updated_by) references auth.users(id) on delete set null;

-- Backfill profiles for existing staff users so names can be shown in the UI.
insert into public.profiles (id, full_name)
select
  users.id,
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name',
    users.email
  )
from auth.users
on conflict (id) do nothing;

-- Automatically create a profile row for new invited staff accounts.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.email
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

-- Make sure logged-in staff can read profile names for "rented by" / "last changed by".
drop policy if exists "Staff can read profiles" on public.profiles;

create policy "Staff can read profiles"
on public.profiles
for select
to authenticated
using (true);
