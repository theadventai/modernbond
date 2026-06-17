-- ═══════════════════════════════════════════════════════════════
-- Modern Bond — Moderation layer
-- ADDITIVE migration. Safe to run on a LIVE database — it does NOT
-- drop or wipe any existing tables/data. Run once in the Supabase
-- SQL Editor (Dashboard → SQL Editor → New query → paste → Run).
-- ═══════════════════════════════════════════════════════════════

-- ── Moderator check ─────────────────────────────────────────────
-- security definer so it can read profiles without tripping RLS
-- (and without recursive policy evaluation).
create or replace function public.is_moderator()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_moderator from public.profiles where id = auth.uid()), false);
$$;

-- ── Moderator override policies ─────────────────────────────────
-- Moderators can delete ANY post or comment (on top of the existing
-- "users delete own ..." policies — Postgres ORs permissive policies).
drop policy if exists "moderators delete any post" on public.posts;
create policy "moderators delete any post" on public.posts
  for delete using (public.is_moderator());

drop policy if exists "moderators delete any comment" on public.comments;
create policy "moderators delete any comment" on public.comments
  for delete using (public.is_moderator());

-- Moderators manage categories.
drop policy if exists "moderators insert categories" on public.categories;
create policy "moderators insert categories" on public.categories
  for insert with check (public.is_moderator());

drop policy if exists "moderators update categories" on public.categories;
create policy "moderators update categories" on public.categories
  for update using (public.is_moderator()) with check (public.is_moderator());

drop policy if exists "moderators delete categories" on public.categories;
create policy "moderators delete categories" on public.categories
  for delete using (public.is_moderator());

-- ── Reports (flagged content) ───────────────────────────────────
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter    uuid not null references public.profiles (id) on delete cascade,
  post_id     uuid references public.posts (id)    on delete cascade,
  comment_id  uuid references public.comments (id) on delete cascade,
  reason      text not null check (char_length(reason) between 1 and 500),
  status      text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at  timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references public.profiles (id),
  -- a report must point at exactly one piece of content
  check (post_id is not null or comment_id is not null)
);
create index if not exists reports_status_idx on public.reports (status, created_at desc);

alter table public.reports enable row level security;

-- Logged-in users can file a report as themselves.
drop policy if exists "users create own reports" on public.reports;
create policy "users create own reports" on public.reports
  for insert with check (auth.uid() = reporter);

-- Only moderators can read / triage / delete reports.
drop policy if exists "moderators read reports" on public.reports;
create policy "moderators read reports" on public.reports
  for select using (public.is_moderator());

drop policy if exists "moderators update reports" on public.reports;
create policy "moderators update reports" on public.reports
  for update using (public.is_moderator()) with check (public.is_moderator());

drop policy if exists "moderators delete reports" on public.reports;
create policy "moderators delete reports" on public.reports
  for delete using (public.is_moderator());

-- ── Report queue view ───────────────────────────────────────────
-- security_invoker = on → the "moderators read reports" RLS above
-- applies, so non-moderators get zero rows from this view.
create or replace view public.report_queue
with (security_invoker = on) as
select
  r.id, r.reason, r.status, r.created_at,
  r.reporter, rp.username as reporter_username,
  r.post_id, p.title as post_title, p.body as post_body, pa.username as post_author,
  r.comment_id, cm.body as comment_body, ca.username as comment_author
from public.reports r
join public.profiles  rp on rp.id = r.reporter
left join public.posts    p  on p.id  = r.post_id
left join public.profiles pa on pa.id = p.author
left join public.comments cm on cm.id = r.comment_id
left join public.profiles ca on ca.id = cm.author;

-- ── Make yourself a moderator ───────────────────────────────────
-- Run ONE of these after the rest, replacing the placeholder:
--   update public.profiles set is_moderator = true where username = 'your_username';
-- or by email:
--   update public.profiles set is_moderator = true
--   where id = (select id from auth.users where email = 'you@example.com');
