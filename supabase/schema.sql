-- ═══════════════════════════════════════════════════════════════
-- Modern Bond — Community Forum schema
-- Paste this entire file into the Supabase SQL Editor and run it once.
-- (Supabase Dashboard → SQL Editor → New query → paste → Run)
--
-- Safe to re-run: it wipes and recreates the forum tables below.
-- ⚠ The drop section erases all existing posts/comments/votes —
-- fine during setup, do NOT re-run once the community is live.
-- ═══════════════════════════════════════════════════════════════

drop view  if exists public.post_feed;
drop table if exists public.votes      cascade;
drop table if exists public.comments   cascade;
drop table if exists public.posts      cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles   cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- ── Profiles (one row per signed-up user) ───────────────────────
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique not null check (char_length(username) between 3 and 24),
  avatar_url   text,
  is_moderator boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Auto-create a profile when a user signs up.
-- Username comes from the signup form (user metadata), falls back to email prefix.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Categories ──────────────────────────────────────────────────
create table public.categories (
  id          serial primary key,
  slug        text unique not null,
  name        text not null,
  description text
);

insert into public.categories (slug, name, description) values
  ('general', 'General',  'Open conversation — anything on your mind'),
  ('connect', 'Connect',  'Meet the community and find your people'),
  ('share',   'Share',    'Stories, wins, and lessons learned'),
  ('grow',    'Grow',     'Questions, advice, and personal growth');

-- ── Posts (threads) ─────────────────────────────────────────────
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  author      uuid not null references public.profiles (id) on delete cascade,
  category_id int  not null references public.categories (id),
  title       text not null check (char_length(title) between 3 and 200),
  body        text not null check (char_length(body) between 1 and 10000),
  created_at  timestamptz not null default now()
);
create index posts_category_idx on public.posts (category_id, created_at desc);

-- ── Comments (nested via parent_id) ─────────────────────────────
create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts (id) on delete cascade,
  author     uuid not null references public.profiles (id) on delete cascade,
  parent_id  uuid references public.comments (id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at);

-- ── Votes (+1 / −1, one per user per post) ──────────────────────
create table public.votes (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  post_id    uuid not null references public.posts (id) on delete cascade,
  value      smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- ── Feed view: posts + author + score + comment count ───────────
create or replace view public.post_feed
with (security_invoker = on) as
select
  p.id, p.title, p.body, p.created_at, p.author,
  c.id   as category_id,
  c.slug as category_slug,
  c.name as category_name,
  pr.username,
  pr.avatar_url,
  coalesce(v.score, 0)          as score,
  coalesce(cm.comment_count, 0) as comment_count
from public.posts p
join public.profiles   pr on pr.id = p.author
join public.categories c  on c.id  = p.category_id
left join (
  select post_id, sum(value) as score
  from public.votes group by post_id
) v on v.post_id = p.id
left join (
  select post_id, count(*) as comment_count
  from public.comments group by post_id
) cm on cm.post_id = p.id;

-- ── Row Level Security ──────────────────────────────────────────
alter table public.profiles   enable row level security;
alter table public.categories enable row level security;
alter table public.posts      enable row level security;
alter table public.comments   enable row level security;
alter table public.votes      enable row level security;

-- Everyone (including logged-out visitors) can read.
create policy "profiles are public"   on public.profiles   for select using (true);
create policy "categories are public" on public.categories for select using (true);
create policy "posts are public"      on public.posts      for select using (true);
create policy "comments are public"   on public.comments   for select using (true);
create policy "votes are public"      on public.votes      for select using (true);

-- Logged-in users can only write as themselves.
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "users create own posts" on public.posts
  for insert with check (auth.uid() = author);
create policy "users edit own posts" on public.posts
  for update using (auth.uid() = author) with check (auth.uid() = author);
create policy "users delete own posts" on public.posts
  for delete using (auth.uid() = author);

create policy "users create own comments" on public.comments
  for insert with check (auth.uid() = author);
create policy "users edit own comments" on public.comments
  for update using (auth.uid() = author) with check (auth.uid() = author);
create policy "users delete own comments" on public.comments
  for delete using (auth.uid() = author);

create policy "users create own votes" on public.votes
  for insert with check (auth.uid() = user_id);
create policy "users change own votes" on public.votes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users remove own votes" on public.votes
  for delete using (auth.uid() = user_id);
