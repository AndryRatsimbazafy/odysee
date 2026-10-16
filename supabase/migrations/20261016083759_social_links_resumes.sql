-- Social links and resumes (one PDF per locale).

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resumes (
  locale public.locale primary key,
  file_path text not null,
  updated_at timestamptz not null default now()
);

create trigger social_links_set_updated_at
  before update on public.social_links
  for each row execute function private.set_updated_at();

create trigger resumes_set_updated_at
  before update on public.resumes
  for each row execute function private.set_updated_at();

alter table public.social_links enable row level security;
alter table public.resumes enable row level security;

create policy "social_links: public read"
  on public.social_links for select to anon, authenticated using (true);
create policy "social_links: admin insert"
  on public.social_links for insert to authenticated
  with check ((select private.is_admin()));
create policy "social_links: admin update"
  on public.social_links for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "social_links: admin delete"
  on public.social_links for delete to authenticated
  using ((select private.is_admin()));

create policy "resumes: public read"
  on public.resumes for select to anon, authenticated using (true);
create policy "resumes: admin insert"
  on public.resumes for insert to authenticated
  with check ((select private.is_admin()));
create policy "resumes: admin update"
  on public.resumes for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "resumes: admin delete"
  on public.resumes for delete to authenticated
  using ((select private.is_admin()));

grant select on public.social_links, public.resumes to anon, authenticated;
grant insert, update, delete on public.social_links, public.resumes to authenticated;
