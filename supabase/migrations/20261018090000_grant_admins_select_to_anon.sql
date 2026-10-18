-- private.is_admin() is SECURITY INVOKER and reads public.admins as the caller.
-- Policies like `status = 'published' or (select private.is_admin())` call it
-- for anon on any unpublished row, which failed with "permission denied for
-- table admins". anon gets the privilege but no policy, so it reads zero rows.
grant select on public.admins to anon;
