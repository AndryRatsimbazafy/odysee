-- Single-row profile: identity, hero, narration, bios, availability, home SEO.

create table public.profile (
  id boolean primary key default true check (id),
  full_name text not null default '',
  title_fr text not null default '',
  title_en text not null default '',
  tagline_fr text not null default '',
  tagline_en text not null default '',
  recit_fr text not null default '',
  recit_en text not null default '',
  bio_fr text not null default '',
  bio_en text not null default '',
  hephaistos_fr text not null default '',
  hephaistos_en text not null default '',
  athena_fr text not null default '',
  athena_en text not null default '',
  photo_path text,
  photo_alt_fr text not null default '',
  photo_alt_en text not null default '',
  location text not null default '',
  languages_fr text not null default '',
  languages_en text not null default '',
  is_available boolean not null default true,
  availability_modes text[] not null default '{}'
    check (availability_modes <@ array['cdi', 'freelance', 'remote']),
  availability_fr text not null default '',
  availability_en text not null default '',
  seo_title_fr text not null default '',
  seo_title_en text not null default '',
  seo_description_fr text not null default '',
  seo_description_en text not null default '',
  og_image_path text,
  updated_at timestamptz not null default now()
);

create trigger profile_set_updated_at
  before update on public.profile
  for each row execute function private.set_updated_at();

alter table public.profile enable row level security;

create policy "profile: public read"
  on public.profile for select
  to anon, authenticated
  using (true);

create policy "profile: admin insert"
  on public.profile for insert
  to authenticated
  with check ((select private.is_admin()));

create policy "profile: admin update"
  on public.profile for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "profile: admin delete"
  on public.profile for delete
  to authenticated
  using ((select private.is_admin()));

grant select on public.profile to anon, authenticated;
grant insert, update, delete on public.profile to authenticated;
