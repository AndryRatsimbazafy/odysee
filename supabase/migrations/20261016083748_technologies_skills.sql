-- Forge: technologies (plates with optional legendary weapon) and skills.

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null default '',
  years_of_use numeric(3, 1) check (years_of_use >= 0),
  duration_label_fr text not null default '',
  duration_label_en text not null default '',
  weapon public.weapon,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  label_fr text not null default '',
  label_en text not null default '',
  description_fr text not null default '',
  description_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger technologies_set_updated_at
  before update on public.technologies
  for each row execute function private.set_updated_at();

create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function private.set_updated_at();

alter table public.technologies enable row level security;
alter table public.skills enable row level security;

-- technologies
create policy "technologies: public read"
  on public.technologies for select to anon, authenticated using (true);
create policy "technologies: admin insert"
  on public.technologies for insert to authenticated
  with check ((select private.is_admin()));
create policy "technologies: admin update"
  on public.technologies for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "technologies: admin delete"
  on public.technologies for delete to authenticated
  using ((select private.is_admin()));

-- skills
create policy "skills: public read"
  on public.skills for select to anon, authenticated using (true);
create policy "skills: admin insert"
  on public.skills for insert to authenticated
  with check ((select private.is_admin()));
create policy "skills: admin update"
  on public.skills for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "skills: admin delete"
  on public.skills for delete to authenticated
  using ((select private.is_admin()));

grant select on public.technologies, public.skills to anon, authenticated;
grant insert, update, delete on public.technologies, public.skills to authenticated;
