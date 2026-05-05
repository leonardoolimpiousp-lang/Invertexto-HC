alter table public.resident_procedure_logs
  add column if not exists unsuccessful boolean not null default false;
