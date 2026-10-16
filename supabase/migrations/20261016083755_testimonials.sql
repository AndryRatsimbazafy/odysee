-- Delphi: testimonials. Only published ones are public.

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote_fr text not null default '',
  quote_en text not null default '',
  author text not null default '',
  role_fr text not null default '',
  role_en text not null default '',
  company text not null default '',
  is_anonymized boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function private.set_updated_at();

alter table public.testimonials enable row level security;

create policy "testimonials: read published or admin"
  on public.testimonials for select to anon, authenticated
  using (is_published or (select private.is_admin()));
create policy "testimonials: admin insert"
  on public.testimonials for insert to authenticated
  with check ((select private.is_admin()));
create policy "testimonials: admin update"
  on public.testimonials for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "testimonials: admin delete"
  on public.testimonials for delete to authenticated
  using ((select private.is_admin()));

grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
