alter table public.resident_procedure_logs
  drop constraint if exists resident_procedure_logs_assistance_check;

update public.resident_procedure_logs
set assistance = 'r_plus'
where assistance = 'e_plus';

alter table public.resident_procedure_logs
  add constraint resident_procedure_logs_assistance_check
  check (assistance in ('assistente', 'r_plus', 'preceptor', 'sem_auxilio'));
