-- Agora: volunteer engagements (Rotaract) and the roles held.

create table public.engagements (
  id uuid primary key default gen_random_uuid(),
  organization text not null default '',
  since smallint check (since between 1900 and 2100),
  text_fr text not null default '',
  text_en text not null default '',
  url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.engagement_roles (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references public.engagements (id) on delete cascade,
  label_fr text not null default '',
  label_en text not null default '',
  period text not null default '',
  sort_order integer not null default 0
);

create index engagement_roles_engagement_id_idx on public.engagement_roles (engagement_id);

create trigger engagements_set_updated_at
  before update on public.engagements
  for each row execute function private.set_updated_at();

alter table public.engagements enable row level security;
alter table public.engagement_roles enable row level security;

create policy "engagements: public read"
  on public.engagements for select to anon, authenticated using (true);
create policy "engagements: admin insert"
  on public.engagements for insert to authenticated
  with check ((select private.is_admin()));
create policy "engagements: admin update"
  on public.engagements for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "engagements: admin delete"
  on public.engagements for delete to authenticated
  using ((select private.is_admin()));

create policy "engagement_roles: public read"
  on public.engagement_roles for select to anon, authenticated using (true);
create policy "engagement_roles: admin insert"
  on public.engagement_roles for insert to authenticated
  with check ((select private.is_admin()));
create policy "engagement_roles: admin update"
  on public.engagement_roles for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "engagement_roles: admin delete"
  on public.engagement_roles for delete to authenticated
  using ((select private.is_admin()));

grant select on public.engagements, public.engagement_roles to anon, authenticated;
grant insert, update, delete on public.engagements, public.engagement_roles to authenticated;
