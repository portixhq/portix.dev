-- Extends the waitlist into a qualified "Join Developer Preview" signup —
-- see ROADMAP.md's Fase 8. All new columns are nullable: existing rows
-- (email-only signups from the original waitlist) stay valid.
alter table public.waitlist
  add column if not exists name text,
  add column if not exists github text,
  add column if not exists company text,
  add column if not exists framework text,
  add column if not exists printer text,
  add column if not exists use_case text;
