-- Trials: projects, gallery, stack links and slug redirects (SEO-10).

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status public.project_status not null default 'draft',
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  scene public.project_scene,
  title_fr text not null default '',
  title_en text not null default '',
  fun_subtitle_fr text not null default '',
  fun_subtitle_en text not null default '',
  quest_fr text not null default '',
  quest_en text not null default '',
  narration_fr text not null default '',
  narration_en text not null default '',
  charon_line_fr text not null default '',
  charon_line_en text not null default '',
  summary_fr text not null default '',
  summary_en text not null default '',
  context_fr text not null default '',
  context_en text not null default '',
  role_fr text not null default '',
  role_en text not null default '',
  challenges_fr text not null default '',
  challenges_en text not null default '',
  solutions_fr text not null default '',
  solutions_en text not null default '',
  results_fr text not null default '',
  results_en text not null default '',
  period_fr text not null default '',
  period_en text not null default '',
  team_fr text not null default '',
  team_en text not null default '',
  client_name text not null default '',
  show_client boolean not null default false,
  is_confidential boolean not null default false,
  is_associative boolean not null default false,
  cover_path text,
  cover_alt_fr text not null default '',
  cover_alt_en text not null default '',
  demo_url text,
  repo_url text,
  seo_title_fr text not null default '',
  seo_title_en text not null default '',
  seo_description_fr text not null default '',
  seo_description_en text not null default '',
  og_image_path text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  alt_fr text not null default '',
  alt_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.project_technologies (
  project_id uuid not null references public.projects (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (project_id, technology_id)
);

create table public.slug_redirects (
  old_slug text primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index projects_status_sort_order_idx on public.projects (status, sort_order);
create index project_images_project_id_idx on public.project_images (project_id);
create index project_technologies_technology_id_idx on public.project_technologies (technology_id);
create index slug_redirects_project_id_idx on public.slug_redirects (project_id);

-- Triggers -------------------------------------------------------------------

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function private.set_updated_at();

-- Stamp published_at the first time a project is published.
create function private.set_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger projects_set_published_at
  before insert or update of status on public.projects
  for each row execute function private.set_published_at();

-- Keep the old slug as a redirect when it changes; a slug taken back
-- by a project must no longer redirect.
create function private.track_slug_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  delete from public.slug_redirects where old_slug = new.slug;
  insert into public.slug_redirects (old_slug, project_id)
  values (old.slug, new.id)
  on conflict (old_slug) do update set project_id = excluded.project_id;
  return new;
end;
$$;

create trigger projects_track_slug_change
  after update of slug on public.projects
  for each row
  when (old.slug is distinct from new.slug)
  execute function private.track_slug_change();

-- RLS ------------------------------------------------------------------------

alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_technologies enable row level security;
alter table public.slug_redirects enable row level security;

-- projects: published ones are public, drafts are admin-only.
create policy "projects: read published or admin"
  on public.projects for select to anon, authenticated
  using (status = 'published' or (select private.is_admin()));
create policy "projects: admin insert"
  on public.projects for insert to authenticated
  with check ((select private.is_admin()));
create policy "projects: admin update"
  on public.projects for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "projects: admin delete"
  on public.projects for delete to authenticated
  using ((select private.is_admin()));

-- Child tables follow their project's visibility.
create policy "project_images: read if project published or admin"
  on public.project_images for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );
create policy "project_images: admin insert"
  on public.project_images for insert to authenticated
  with check ((select private.is_admin()));
create policy "project_images: admin update"
  on public.project_images for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "project_images: admin delete"
  on public.project_images for delete to authenticated
  using ((select private.is_admin()));

create policy "project_technologies: read if project published or admin"
  on public.project_technologies for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );
create policy "project_technologies: admin insert"
  on public.project_technologies for insert to authenticated
  with check ((select private.is_admin()));
create policy "project_technologies: admin update"
  on public.project_technologies for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "project_technologies: admin delete"
  on public.project_technologies for delete to authenticated
  using ((select private.is_admin()));

create policy "slug_redirects: read if project published or admin"
  on public.slug_redirects for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );
create policy "slug_redirects: admin insert"
  on public.slug_redirects for insert to authenticated
  with check ((select private.is_admin()));
create policy "slug_redirects: admin update"
  on public.slug_redirects for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "slug_redirects: admin delete"
  on public.slug_redirects for delete to authenticated
  using ((select private.is_admin()));

grant select on public.projects, public.project_images,
  public.project_technologies, public.slug_redirects to anon, authenticated;
grant insert, update, delete on public.projects, public.project_images,
  public.project_technologies, public.slug_redirects to authenticated;
