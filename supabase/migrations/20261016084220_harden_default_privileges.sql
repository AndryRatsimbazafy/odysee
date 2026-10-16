-- This project still has Supabase's legacy default privileges (ALL on new
-- tables to anon/authenticated, TRUNCATE included, which RLS does not cover).
-- Reset to least privilege: only the explicit grants below apply, and future
-- tables must grant what they need in their own migration.

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;

revoke all on all tables in schema public from anon, authenticated;

-- Public content: read for everyone (rows filtered by RLS), write for admins.
grant select on
  public.profile, public.technologies, public.skills,
  public.projects, public.project_images, public.project_technologies, public.slug_redirects,
  public.experiences, public.experience_technologies,
  public.testimonials, public.engagements, public.engagement_roles,
  public.social_links, public.resumes
to anon, authenticated;

grant insert, update, delete on
  public.profile, public.technologies, public.skills,
  public.projects, public.project_images, public.project_technologies, public.slug_redirects,
  public.experiences, public.experience_technologies,
  public.testimonials, public.engagements, public.engagement_roles,
  public.social_links, public.resumes
to authenticated;

-- Admin-only tables.
grant select, update, delete on public.contact_messages to authenticated;
grant select on public.admins to authenticated;
