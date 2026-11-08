-- Run in Supabase SQL Editor. Create your admin user via Authentication > Users first.
create extension if not exists pgcrypto;
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.events (
 id uuid primary key default gen_random_uuid(), title text not null check(length(title) between 1 and 150), description text not null default '',category text not null default '聚會',location text not null,starts_at timestamptz not null,ends_at timestamptz not null,price_cents integer not null default 0 check(price_cents>=0),capacity integer not null check(capacity between 1 and 100),status text not null default 'draft' check(status in ('draft','published','full','cancelled')),image_url text,created_at timestamptz not null default now(),check(ends_at>starts_at));
create table if not exists public.registrations (
 id uuid primary key default gen_random_uuid(),event_id uuid not null references public.events(id) on delete cascade,name text not null check(length(name) between 1 and 80),email text not null check(length(email)<=200),created_at timestamptz not null default now(),unique(event_id,email));
create index if not exists registrations_event_idx on public.registrations(event_id);
alter table public.admins enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
-- Only published/full events visible to anonymous visitors.
create policy "public published events" on public.events for select to anon,authenticated using(status in ('published','full'));
-- Admin pages use the service-role client only after checking admins membership.
-- No public direct registration inserts/reads. All registration requests go through this atomic function.
create or replace function public.register_for_event(p_event_id uuid,p_name text,p_email text)
returns text language plpgsql security definer set search_path=public as $$
declare ev public.events%rowtype; n integer;
begin
 if length(trim(p_name)) not between 1 and 80 or length(trim(p_email))>200 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then return 'invalid'; end if;
 select * into ev from public.events where id=p_event_id for update;
 if not found or ev.status<>'published' or ev.starts_at<=now() then return 'closed'; end if;
 if exists(select 1 from public.registrations where event_id=p_event_id and email=lower(trim(p_email))) then return 'duplicate'; end if;
 select count(*) into n from public.registrations where event_id=p_event_id;
 if n>=ev.capacity then return 'full'; end if;
 insert into public.registrations(event_id,name,email) values(p_event_id,trim(p_name),lower(trim(p_email)));
 if n+1>=ev.capacity then update public.events set status='full' where id=p_event_id; end if;
 return 'ok';
end;$$;
revoke all on function public.register_for_event(uuid,text,text) from public;
grant execute on function public.register_for_event(uuid,text,text) to anon,authenticated;
-- IMPORTANT: grant admin role only to your own Supabase Auth user UUID:
-- insert into public.admins(user_id) values ('YOUR-AUTH-USER-UUID');
