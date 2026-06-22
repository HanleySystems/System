-- Run this once in Supabase SQL Editor before deploying the updated frontend.
-- It lets the app store and display who last changed a container/rental.

alter table public.containers
add column if not exists updated_by uuid references public.profiles(id);

alter table public.rentals
add column if not exists created_by uuid references public.profiles(id),
add column if not exists updated_by uuid references public.profiles(id);

-- Make sure logged-in staff can read profile names for the "rented by" UI.
drop policy if exists "Staff can read profiles" on public.profiles;

create policy "Staff can read profiles"
on public.profiles
for select
to authenticated
using (true);
