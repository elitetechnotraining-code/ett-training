-- Create the contact_messages table used by src/components/ContactUs.jsx
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  comment text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS so policies can control access
alter table public.contact_messages enable row level security;

-- Clean up old policies if they exist
 drop policy if exists "contact_messages_insert" on public.contact_messages;
 drop policy if exists "contact_messages_select" on public.contact_messages;

-- Allow anonymous users (your public website) to submit comments
create policy "contact_messages_insert"
on public.contact_messages
for insert
 to anon, authenticated
with check (true);

-- Optional: allow admins to read the messages from Supabase Dashboard or client-side admin tools
create policy "contact_messages_select"
on public.contact_messages
for select
 to anon, authenticated
using (true);

