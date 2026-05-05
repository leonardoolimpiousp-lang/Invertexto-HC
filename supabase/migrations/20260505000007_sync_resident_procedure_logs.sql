create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table if not exists public.resident_procedure_logs (
  id uuid primary key default gen_random_uuid(),
  slug text not null references public.profiles(slug) on delete cascade,
  procedure_id text not null,
  procedure_name text not null,
  performed_at date not null,
  training_year text not null,
  previous_experience integer not null default 0,
  patient_type text not null,
  assistance text not null,
  first_attempt_success boolean not null,
  unsuccessful boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resident_procedure_logs
  add column if not exists unsuccessful boolean;

update public.resident_procedure_logs
set unsuccessful = false
where unsuccessful is null;

alter table public.resident_procedure_logs
  alter column unsuccessful set default false,
  alter column unsuccessful set not null;

update public.resident_procedure_logs
set assistance = 'r_plus'
where assistance = 'e_plus';

alter table public.resident_procedure_logs
  drop constraint if exists resident_procedure_logs_training_year_check,
  drop constraint if exists resident_procedure_logs_previous_experience_check,
  drop constraint if exists resident_procedure_logs_patient_type_check,
  drop constraint if exists resident_procedure_logs_assistance_check;

alter table public.resident_procedure_logs
  add constraint resident_procedure_logs_training_year_check
    check (training_year in ('5_ano', '6_ano', 'R1', 'R2', 'R3', 'R_plus')),
  add constraint resident_procedure_logs_previous_experience_check
    check (previous_experience >= 0),
  add constraint resident_procedure_logs_patient_type_check
    check (patient_type in ('adulto', 'pediatrico')),
  add constraint resident_procedure_logs_assistance_check
    check (assistance in ('assistente', 'r_plus', 'preceptor', 'sem_auxilio'));

create index if not exists resident_procedure_logs_slug_idx
  on public.resident_procedure_logs(slug, performed_at desc);

create index if not exists resident_procedure_logs_procedure_idx
  on public.resident_procedure_logs(procedure_id, performed_at desc);

drop trigger if exists resident_procedure_logs_touch_updated_at on public.resident_procedure_logs;
create trigger resident_procedure_logs_touch_updated_at
  before update on public.resident_procedure_logs
  for each row execute function public.touch_updated_at();

alter table public.resident_procedure_logs enable row level security;

drop policy if exists "resident_procedure_logs_read" on public.resident_procedure_logs;
drop policy if exists "resident_procedure_logs_insert" on public.resident_procedure_logs;
drop policy if exists "resident_procedure_logs_update" on public.resident_procedure_logs;
drop policy if exists "resident_procedure_logs_delete" on public.resident_procedure_logs;

create policy "resident_procedure_logs_read"
  on public.resident_procedure_logs for select using (true);

create policy "resident_procedure_logs_insert"
  on public.resident_procedure_logs for insert with check (true);

create policy "resident_procedure_logs_update"
  on public.resident_procedure_logs for update using (true) with check (true);

create policy "resident_procedure_logs_delete"
  on public.resident_procedure_logs for delete using (true);
