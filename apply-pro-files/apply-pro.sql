-- ============================================================
-- APPLY PRO — run once in the Supabase SQL editor.
-- Safe to run again: everything uses "if not exists" / "on conflict".
-- All new tables are read and written only by your server (service key),
-- so RLS is switched on with no public policies.
-- ============================================================

-- 1. Paid Apply Pro members (you switch people on here or in /admin/applications)
create table if not exists apply_pro (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text,
  pro_until   timestamptz not null,
  days_total  int not null default 0,
  updated_at  timestamptz not null default now()
);
alter table apply_pro enable row level security;

-- 2. Saved application details, so members only upload their resume and photo once
create table if not exists apply_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  nationality  text,
  video_link   text,
  about        text,
  resume_path  text,
  photo_path   text,
  updated_at   timestamptz not null default now()
);
alter table apply_profiles enable row level security;

-- 3. Every AI-written application (also the "use a previous letter" list)
create table if not exists ai_letters (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  job_id         text,
  job_title      text,
  company        text,
  email_subject  text,
  message        text,
  cover_letter   text,
  message_th     text,
  chat_message   text,
  counted        boolean not null default true,   -- false = a free rewrite
  created_at     timestamptz not null default now()
);
create index if not exists ai_letters_user_idx on ai_letters (user_id, created_at desc);
create index if not exists ai_letters_user_job_idx on ai_letters (user_id, job_id);
alter table ai_letters enable row level security;

-- 4. Master on/off switch for Apply Pro (partner schools like Oneness are not affected)
create table if not exists app_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now()
);
alter table app_settings enable row level security;
insert into app_settings (key, value) values ('apply_pro', 'on') on conflict (key) do nothing;

-- 5. New columns on the existing applications table
alter table job_applications add column if not exists user_id      uuid;
alter table job_applications add column if not exists apply_type   text not null default 'partner'; -- partner | pro | free_try
alter table job_applications add column if not exists to_email     text;
alter table job_applications add column if not exists video_link   text;
alter table job_applications add column if not exists cover_letter text;
alter table job_applications add column if not exists message_th   text;
alter table job_applications add column if not exists viewed_at    timestamptz;
alter table job_applications add column if not exists view_count   int not null default 0;
alter table job_applications alter column partner_key drop not null;  -- Apply Pro jobs have no partner
create index if not exists job_applications_user_idx    on job_applications (user_id, created_at desc);
create index if not exists job_applications_created_idx on job_applications (created_at desc);


-- ============================================================
-- HANDY SQL FOR LATER (you can also do these in /admin/applications)
-- ============================================================

-- Switch on Apply Pro for a paying member: change the email and the days (30 or 180).
-- If they are still active, the days are added on to their current end date.
--
-- insert into apply_pro (user_id, email, pro_until, days_total)
-- select id, email, now() + interval '30 days', 30
-- from auth.users where lower(email) = lower('teacher@example.com')
-- on conflict (user_id) do update
-- set pro_until  = greatest(apply_pro.pro_until, now()) + interval '30 days',
--     days_total = apply_pro.days_total + 30,
--     updated_at = now();

-- Turn Apply Pro off for everyone (partner schools keep working):
-- update app_settings set value = 'off', updated_at = now() where key = 'apply_pro';

-- See who is on Apply Pro:
-- select email, pro_until from apply_pro where pro_until > now() order by pro_until;
