-- Ports of call: experiences and their stack.

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null default '',
  role_fr text not null default '',
  role_en text not null default '',
  start_date date not null,
  end_date date check (end_date is null or end_date >= start_date),
  location text not null default '',
  is_remote boolean not null default false,
  message_fr text not null default '',
  message_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_technologies (
  experience_id uuid not null references public.experiences (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (experience_id, technology_id)
);

create index experience_technologies_technology_id_idx
  on public.experience_technologies (technology_id);

create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function private.set_updated_at();

alter table public.experiences enable row level security;
alter table public.experience_technologies enable row level security;

create policy "experiences: public read"
  on public.experiences for select to anon, authenticated using (true);
create policy "experiences: admin insert"
  on public.experiences for insert to authenticated
  with check ((select private.is_admin()));
create policy "experiences: admin update"
  on public.experiences for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "experiences: admin delete"
  on public.experiences for delete to authenticated
  using ((select private.is_admin()));

create policy "experience_technologies: public read"
  on public.experience_technologies for select to anon, authenticated using (true);
create policy "experience_technologies: admin insert"
  on public.experience_technologies for insert to authenticated
  with check ((select private.is_admin()));
create policy "experience_technologies: admin update"
  on public.experience_technologies for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "experience_technologies: admin delete"
  on public.experience_technologies for delete to authenticated
  using ((select private.is_admin()));

grant select on public.experiences, public.experience_technologies to anon, authenticated;
grant insert, update, delete on public.experiences, public.experience_technologies to authenticated;
