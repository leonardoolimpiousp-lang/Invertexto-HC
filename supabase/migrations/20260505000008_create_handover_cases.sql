create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table if not exists public.handover_cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null references public.profiles(slug) on delete cascade,
  leito text not null,
  paciente text not null,
  idade text not null default '',
  severity text check (severity in ('estavel', 'instavel', 'grave')),
  patient_summary text not null default '',
  action_list text not null default '',
  situation text not null default '',
  synthesis text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists handover_cases_slug_idx
  on public.handover_cases(slug, created_at desc);

drop trigger if exists handover_cases_touch_updated_at on public.handover_cases;
create trigger handover_cases_touch_updated_at
  before update on public.handover_cases
  for each row execute function public.touch_updated_at();

alter table public.handover_cases enable row level security;

drop policy if exists "handover_cases_read" on public.handover_cases;
drop policy if exists "handover_cases_insert" on public.handover_cases;
drop policy if exists "handover_cases_update" on public.handover_cases;
drop policy if exists "handover_cases_delete" on public.handover_cases;

create policy "handover_cases_read"
  on public.handover_cases for select using (true);

create policy "handover_cases_insert"
  on public.handover_cases for insert with check (true);

create policy "handover_cases_update"
  on public.handover_cases for update using (true) with check (true);

create policy "handover_cases_delete"
  on public.handover_cases for delete using (true);
