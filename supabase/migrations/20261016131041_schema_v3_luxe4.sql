-- Schema v3 (luxe-4): archive dossier, oracle, gods' domains, arsenal.
-- No content exists yet, so dropped columns lose nothing.

-- Enums ----------------------------------------------------------------------

-- Emblems are engraving keys (DESIGN §5); the v2 "scene" already held them.
alter type public.project_scene rename to project_emblem;

-- Full arsenal (DESIGN §5): 12 weapons.
alter type public.weapon add value if not exists 'lyre';
alter type public.weapon add value if not exists 'bouclier';
alter type public.weapon add value if not exists 'ancre';

-- projects -------------------------------------------------------------------

alter table public.projects rename column scene to emblem;

alter table public.projects
  add column short_title_fr text not null default '',
  add column short_title_en text not null default '',
  add column kind text not null default 'client'
    check (kind in ('client', 'associative', 'personal')),
  add column kind_label_fr text not null default '',
  add column kind_label_en text not null default '',
  add column layout text not null default 'split'
    check (layout in ('sealed', 'split', 'gallery', 'process')),
  add column problem_fr text not null default '',
  add column problem_en text not null default '',
  add column role_label_fr text not null default '',
  add column role_label_en text not null default '',
  drop column fun_subtitle_fr,
  drop column fun_subtitle_en,
  drop column narration_fr,
  drop column narration_en,
  drop column challenges_fr,
  drop column challenges_en,
  drop column solutions_fr,
  drop column solutions_en,
  drop column results_fr,
  drop column results_en;

-- project_images: plates (an empty path = "[à fournir]" slot) ----------------

alter table public.project_images
  alter column path drop not null,
  add column kind_fr text not null default '',
  add column kind_en text not null default '',
  add column caption_fr text not null default '',
  add column caption_en text not null default '',
  add column ratio text not null default '16/10'
    check (ratio in ('16/10', '1/1', '4/5', '21/9', '3/4', '16/9'));

-- project_technologies / technologies / skills / profile --------------------

alter table public.project_technologies
  add column usage_fr text not null default '',
  add column usage_en text not null default '';

alter table public.technologies
  add column role_fr text not null default '',
  add column role_en text not null default '',
  add column context_fr text not null default '',
  add column context_en text not null default '';

alter table public.skills
  add column domain text not null default 'hephaistos'
    check (domain in ('hephaistos', 'athena'));

alter table public.profile
  add column available_from date,
  add column public_email text not null default ''
    check (public_email = '' or public_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- New tables -----------------------------------------------------------------

-- Contributions and results of a project, as ordered lists.
create table public.project_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  kind text not null check (kind in ('contribution', 'result')),
  text_fr text not null default '',
  text_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Technical decisions: title · why · trade-off.
create table public.project_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title_fr text not null default '',
  title_en text not null default '',
  why_fr text not null default '',
  why_en text not null default '',
  tradeoff_fr text not null default '',
  tradeoff_en text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- The oracle (chant V).
create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question_fr text not null default '',
  question_en text not null default '',
  answer_fr text not null default '',
  answer_en text not null default '',
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index project_items_project_id_idx on public.project_items (project_id, kind, sort_order);
create index project_decisions_project_id_idx on public.project_decisions (project_id, sort_order);
create index faq_items_published_sort_order_idx on public.faq_items (is_published, sort_order);

create trigger faq_items_set_updated_at
  before update on public.faq_items
  for each row execute function private.set_updated_at();

-- RLS ------------------------------------------------------------------------

alter table public.project_items enable row level security;
alter table public.project_decisions enable row level security;
alter table public.faq_items enable row level security;

-- Child tables follow their project's visibility.
create policy "project_items: read if project published or admin"
  on public.project_items for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );
create policy "project_items: admin insert"
  on public.project_items for insert to authenticated
  with check ((select private.is_admin()));
create policy "project_items: admin update"
  on public.project_items for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "project_items: admin delete"
  on public.project_items for delete to authenticated
  using ((select private.is_admin()));

create policy "project_decisions: read if project published or admin"
  on public.project_decisions for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.status = 'published'
    )
  );
create policy "project_decisions: admin insert"
  on public.project_decisions for insert to authenticated
  with check ((select private.is_admin()));
create policy "project_decisions: admin update"
  on public.project_decisions for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "project_decisions: admin delete"
  on public.project_decisions for delete to authenticated
  using ((select private.is_admin()));

-- faq_items: published ones are public, drafts are admin-only.
create policy "faq_items: read published or admin"
  on public.faq_items for select to anon, authenticated
  using (is_published or (select private.is_admin()));
create policy "faq_items: admin insert"
  on public.faq_items for insert to authenticated
  with check ((select private.is_admin()));
create policy "faq_items: admin update"
  on public.faq_items for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "faq_items: admin delete"
  on public.faq_items for delete to authenticated
  using ((select private.is_admin()));

-- Default privileges were reset (harden_default_privileges): grant explicitly.
grant select on public.project_items, public.project_decisions, public.faq_items
  to anon, authenticated;
grant insert, update, delete on public.project_items, public.project_decisions, public.faq_items
  to authenticated;
