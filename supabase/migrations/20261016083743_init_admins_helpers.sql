-- Shared helpers, enums and the admins allow-list.
-- Helpers live in the `private` schema, which is not exposed by the Data API.

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- Enums ---------------------------------------------------------------------

create type public.locale as enum ('fr', 'en');
create type public.project_status as enum ('draft', 'published');
create type public.project_scene as enum ('maze', 'hydra', 'herald', 'boat');
create type public.weapon as enum (
  'foudre', 'egide', 'trident', 'fil', 'caducee', 'casque', 'harpe', 'arc', 'marteau'
);
create type public.message_status as enum ('unread', 'read');

-- updated_at trigger ---------------------------------------------------------

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- admins ---------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Each signed-in user can only see their own row (enough for is_admin()).
-- No insert/update/delete policy: rows are added by hand in the SQL editor.
create policy "admins: read own row"
  on public.admins for select
  to authenticated
  using (user_id = (select auth.uid()));

grant select on public.admins to authenticated;

-- is_admin() -----------------------------------------------------------------
-- SECURITY INVOKER: relies on the policy above, never bypasses RLS.

create function private.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;
