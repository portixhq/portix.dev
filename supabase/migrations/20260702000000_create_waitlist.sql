create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Row Level Security: no direct client access. All writes go through the
-- "waitlist" Edge Function using the service-role key, which bypasses RLS.
alter table public.waitlist enable row level security;
