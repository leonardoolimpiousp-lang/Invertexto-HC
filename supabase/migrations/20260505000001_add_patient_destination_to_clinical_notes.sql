-- Add discharge destination tracking to clinical notes
alter table clinical_notes
  add column if not exists patient_destination text
  check (patient_destination in ('alta', 'alta_retorno_ambulatorial', 'internacao', 'obito'));
