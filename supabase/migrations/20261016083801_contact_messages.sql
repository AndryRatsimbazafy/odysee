-- Messages sent through Hermès. Inserted by the contact Server Action with
-- the secret key (service_role bypasses RLS); readable by the admin only.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  locale public.locale not null default 'fr',
  ip_hash text not null,
  status public.message_status not null default 'unread',
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- Rate limit lookup: messages per IP hash over the last hour.
create index contact_messages_ip_hash_created_at_idx
  on public.contact_messages (ip_hash, created_at desc);

alter table public.contact_messages enable row level security;

-- No insert policy and no grant to anon: the public cannot write here directly.
create policy "contact_messages: admin read"
  on public.contact_messages for select to authenticated
  using ((select private.is_admin()));
create policy "contact_messages: admin update"
  on public.contact_messages for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "contact_messages: admin delete"
  on public.contact_messages for delete to authenticated
  using ((select private.is_admin()));

grant select, update, delete on public.contact_messages to authenticated;
grant select, insert, update on public.contact_messages to service_role;
